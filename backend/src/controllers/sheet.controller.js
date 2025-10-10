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

export const getSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const sheet = await prisma.sheet.findUnique({
      where: { id },
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
                description: true,
              },
            },
          },
        },
      },
    });

    if (!sheet) {
      return res.status(404).json({ error: 'Sheet not found.' });
    }

    if (!sheet.isActive && req.user?.id !== sheet.sellerId && req.user?.role !== 'ADMIN') {
      return res.status(404).json({ error: 'Sheet not found.' });
    }

    //เพิ่ม view count 
    prisma.sheet.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(err => console.error('Update view count error:', err));

    //สร้าง signed URL ไว้preview expire 1 ชม
    const signedUrl = cloudinary.url(sheet.fileUrl, {
      sign_url: true,
      type: 'authenticated',
      resource_type: 'raw',
      secure: true,
    });

    const { fileUrl, ...sheetData } = sheet;

    res.json({
      sheet: {
        ...sheetData,
        previewUrl: signedUrl, //Frontend ใช้ URL นี้ขึ้น preview นะ
      },
    });
  } catch (error) {
    console.error(`Get sheet by id error: ${error} | from sheetController`);
    res.status(500).json({ error: 'Failed to get sheet.' });
  }
};