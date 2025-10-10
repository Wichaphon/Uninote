import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllSheets = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      subject, 
      university, 
      faculty,
      department,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      isActive: true, 
    };

    if (subject) {
      where.subject = { contains: subject, mode: 'insensitive' };
    }

    if (university) {
      where.university = { contains: university, mode: 'insensitive' };
    }

    if (faculty) {
      where.faculty = { contains: faculty, mode: 'insensitive' };
    }

    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    orderBy[sortBy] = order;

    const [sheets, total] = await Promise.all([
      prisma.sheet.findMany({
        where,
        skip,
        take,
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              sellerProfile: {
                select: {
                  shopName: true,
                },
              },
            },
          },
        },
        orderBy,
      }),
      prisma.sheet.count({ where }),
    ]);

    res.json({
      sheets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error(`Get all sheets error: ${error} | from sheetController`);
    res.status(500).json({ error: 'Failed to get sheets.' });
  }
};