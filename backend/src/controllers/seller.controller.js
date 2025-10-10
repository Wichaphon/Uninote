import prisma from "../lib/prisma.js";

export const applyAsSeller = async (req, res) => {
    try {
    let { shopName, description, bankAccount } = req.body;

    shopName = shopName.trim();
    description = description?.trim() || null;
    
    if (bankAccount) {
      bankAccount = bankAccount.replace(/\D/g, ''); //เอาทุกอย่างที่ไม่ใช่ตัวเลขออก
      if (bankAccount.length === 0) {
        bankAccount = null;
      }
    } else {
      bankAccount = null;
    }

    //เช็คว่าเคยมี seller profile ไหม
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (existingProfile) {
      return res.status(400).json({ 
        error: 'You have already applied as a seller.',
        status: existingProfile.status 
      });
    }

    //เช็คว่า shopName ซ้ำไหม
    const existingShopName = await prisma.sellerProfile.findFirst({
      where: { 
        shopName: {
          equals: shopName,
          mode: 'insensitive' 
        }
      },
    });

    if (existingShopName) {
      return res.status(400).json({ 
        error: 'This shop name is already taken. Please choose another name.' 
      });
    }

    const sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: req.user.id,
        shopName,
        description,
        bankAccount,
        status: 'PENDING',
      },
      select: {
        id: true,
        shopName: true,
        description: true,
        bankAccount: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'Seller application submitted successfully. Waiting for admin approval.',
      sellerProfile,
    });
  } 
  catch (error) {
    console.error(`Apply as seller error: ${error} | from sellerController`);
    res.status(500).json({ error: 'Failed to submit seller application.' });
  }
};

export const getSellerProfile = async (req, res) => {
  try {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found.' });
    }

    res.json({ sellerProfile });
  } 
  
  catch (error) {
    console.error(`Get seller profile error: ${error} | from sellerController`);
    res.status(500).json({ error: 'Failed to get seller profile.' });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    let { shopName, description, bankAccount } = req.body;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found.' });
    }

    if (shopName !== undefined) {
      shopName = shopName.trim();
    }
    
    if (description !== undefined) {
      description = description.trim();
      if (description.length === 0) {
        description = null;
      }
    }
    
    if (bankAccount !== undefined) {
      bankAccount = bankAccount.trim().replace(/\D/g, '');
      if (bankAccount.length === 0) {
        bankAccount = null;
      }
    }

    //เช็ค shop name ซ้ำถ้ามีการเปลี่ยน
    if (shopName !== undefined && shopName !== sellerProfile.shopName) {
      const existingShopName = await prisma.sellerProfile.findFirst({
        where: { 
          shopName: {
            equals: shopName,
            mode: 'insensitive'
          },
          userId: {
            not: req.user.id
          }
        },
      });

      if (existingShopName) {
        return res.status(400).json({ 
          error: 'This shop name is already taken. Please choose another name.' 
        });
      }
    }

    const updateData = {};
    
    if (shopName !== undefined) {
      updateData.shopName = shopName;
    }
    
    if (description !== undefined) {
      updateData.description = description;
    }
    
    if (bankAccount !== undefined) {
      updateData.bankAccount = bankAccount;
    }

    //Update
    const updatedProfile = await prisma.sellerProfile.update({
      where: { userId: req.user.id },
      data: updateData,
      select: {
        id: true,
        shopName: true,
        description: true,
        bankAccount: true,
        status: true,
        approvedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Seller profile updated successfully.',
      sellerProfile: updatedProfile,
    });
  } catch (error) {
    console.error(`Update seller profile error: ${error} | from sellerController`);
    res.status(500).json({ error: 'Failed to update seller profile.' });
  }
};