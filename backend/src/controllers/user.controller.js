import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

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
}

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
}
