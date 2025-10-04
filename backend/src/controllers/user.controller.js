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
    res.status(500).json({ error: 'An error occurred while fetching the profile.' });
  }
}