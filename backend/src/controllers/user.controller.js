import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import cloudinary from '../lib/cloudinary.js';

export const getProfile = async(req, res) => {
    try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        sellerProfile: {
          select: {
            id: true,
            shopName: true,
            description: true,
            status: true,
            approvedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } 
  catch (error) {
    console.error(`Get profile error: ${error} | from userController`);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
};

export const updateProfile = async(req, res) => {
  try {
    let { firstName, lastName } = req.body;

    //Trim
    if (firstName !== undefined) firstName = firstName.trim();
    if (lastName !== undefined) lastName = lastName.trim();

    if (!firstName && !lastName) {
      return res.status(400).json({ 
        error: 'Please provide at least one field to update' 
      });
    }

    //Validation
    const errors = [];

    if (firstName !== undefined) {
      if (firstName.length === 0) {
        errors.push('First name cannot be empty');
      } else if (firstName.length > 50) {
        errors.push('First name must not exceed 50 characters');
      }
    }

    if (lastName !== undefined) {
      if (lastName.length === 0) {
        errors.push('Last name cannot be empty');
      } else if (lastName.length > 50) {
        errors.push('Last name must not exceed 50 characters');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(`Update profile error: ${error} | from userController`);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide your current and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    //ดึงข้อมูล userกับ password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    //เช็ครหัสก่อนเปลี่ยน
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect current password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS) || 10);

    //update pass
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    //ลบ token ทุก device ออกหมด (บังคับ login ใหม่หมด)
    await prisma.refreshToken.deleteMany({
      where: { userId: req.user.id },
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/api/auth',
    });

    res.json({ 
      message: 'Your password has been changed successfully. Please log in again.',
      requireLogin: true,
    });
  } 
  
  catch (error) {
    console.error(`Change password error: ${error} | from userController`);
    res.status(500).json({ error: 'Failed to change password.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Please enter your password to confirm account deletion.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    //ลบบัญชี Prisma cascadeลบ related dataทั้งหมดออก
    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/api/auth',
    });

    res.json({ message: 'Account deleted.' });
  } catch (error) {
    console.error(`Delete account error: ${error} | from userController`);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
};

export const uploadAvata = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatar: true },
    });

    //ลบรูปเดิมจาก Cloudinary (ยกเว้น DEFAULT_AVATAR_URL)
    if (user.avatar && user.avatar !== process.env.DEFAULT_AVATAR_URL) {
      try {

        const urlParts = user.avatar.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.')) || publicIdWithExt;
          
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted old avatar: ${publicId}`);
        }
      } 
      
      catch (err) {
        console.error('Delete old avatar error:', err);
        
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: req.file.path },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
      },
    });

    res.json({
      message: "Avatar uploaded successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture.' });
  }
};