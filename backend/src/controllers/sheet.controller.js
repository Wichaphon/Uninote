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

export const createSheet = async (req, res) => {
  try {
    const { title, description, subject, year, faculty, department, university, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const trimmedData = {
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      year: year?.trim() || null,
      faculty: faculty?.trim() || null,
      department: department?.trim() || null,
      university: university?.trim() || null,
      price: parseFloat(price),
      fileUrl: req.file.path, 
      sellerId: req.user.id,
    };

    const sheet = await prisma.sheet.create({
      data: trimmedData,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            sellerProfile: {
              select: {
                shopName: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: 'Sheet created successfully.',
      sheet,
    });
  } catch (error) {
    console.error(`Create sheet error: ${error} | from sheetController`);
    
    //ถ้าerrแล้ว PDF upload ไปแล้วจะลบออกจาก Cloudinary ก่อน
    if (req.file) {
      try {
        const urlParts = req.file.path.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1) {
          const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.')) || publicIdWithExt;
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
      } catch (deleteErr) {
        console.error('Failed to delete uploaded PDF after error:', deleteErr);
      }
    }

    res.status(500).json({ error: 'Failed to create sheet.' });
  }
};

export const getMySheets = async (req , res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      sellerId: req.user.id,
    };

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [sheets, total] = await Promise.all([
      prisma.sheet.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
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
    console.error(`Get my sheets error: ${error} | from sheetController`);
    res.status(500).json({ error: 'Failed to get your sheets.' });
  }
};

export const updateSheet = async(req, res) => {
  try {
    const { id } = req.params;
    let { title, description, subject, year, faculty, department, university, price } = req.body;

    const sheet = await prisma.sheet.findUnique({
      where: { id },
    });

    if (!sheet) {
      return res.status(404).json({ error: 'Sheet not found.' });
    }

    if (sheet.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to edit this sheet.' });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (subject !== undefined) {
      updateData.subject = subject.trim();
    }

    if (year !== undefined) {
      updateData.year = year.trim() || null;
    }

    if (faculty !== undefined) {
      updateData.faculty = faculty.trim() || null;
    }

    if (department !== undefined) {
      updateData.department = department.trim() || null;
    }

    if (university !== undefined) {
      updateData.university = university.trim() || null;
    }

    if (price !== undefined) {
      updateData.price = parseFloat(price);
    }

    //ถ้า upload PDF ใหม่
    if (req.file) {
      //ลบ PDF เก่าจาก Cloudinary
      try {
        const urlParts = sheet.fileUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1) {
          const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.')) || publicIdWithExt;
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
      } 
      catch (deleteErr) {
        console.error('Delete old PDF error:', deleteErr);
      }

      updateData.fileUrl = req.file.path;
    }

    const updatedSheet = await prisma.sheet.update({
      where: { id },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            sellerProfile: {
              select: {
                shopName: true,
              },
            },
          },
        },
      },
    });

    res.json({
      message: 'Sheet updated successfully.',
      sheet: updatedSheet,
    });
  } 
  
  catch (error) {
    console.error(`Update sheet error: ${error} | from sheetController`);
    res.status(500).json({ error: 'Failed to update sheet.' });
  }
};