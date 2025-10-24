import prisma from "../lib/prisma.js";

export const getPendingSellers = async (req, res) => {
    try {
        const pendingSellers = await prisma.sellerProfile.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' }, //เก่าสุดก่อน
        });

        res.json({
            count: pendingSellers.length,
            sellers: pendingSellers,
        });
    }

    catch (error) {
        console.error(`Get pending sellers error: ${error} | from adminController`);
        res.status(500).json({ error: 'Failed to get pending sellers.' });
    }
};

export const approveSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const sellerProfile = await prisma.sellerProfile.findUnique({
            where: { id: sellerId },
        });

        if (!sellerProfile) {
            return res.status(404).json({ error: 'Seller profile not found.' });
        }

        if (sellerProfile.status !== 'PENDING') {
            return res.status(400).json({
                error: `Seller application has already been ${sellerProfile.status.toLowerCase()}.`
            });
        }

        await prisma.$transaction([
            prisma.sellerProfile.update({
                where: { id: sellerId },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                    approvedBy: req.user.id,
                },
            }),
            prisma.user.update({
                where: { id: sellerProfile.userId },
                data: { role: 'SELLER' },
            }),
            //บังคับ logout 
            prisma.refreshToken.deleteMany({
                where: { userId: sellerProfile.userId },
            }),
        ]);

        res.json({
            message: 'Seller approved successfully. User must log in again with new role.',
        });
    }

    catch (error) {
        console.error(`Approve seller error: ${error} | from adminController`);
        res.status(500).json({ error: 'Failed to approve seller.' });
    }
};

export const rejectSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const sellerProfile = await prisma.sellerProfile.findUnique({
            where: { id: sellerId },
        });

        if (!sellerProfile) {
            return res.status(404).json({ error: 'Seller profile not found.' });
        }

        if (sellerProfile.status !== 'PENDING') {
            return res.status(400).json({
                error: `Seller application has already been ${sellerProfile.status.toLowerCase()}.`
            });
        }

        await prisma.sellerProfile.update({
            where: { id: sellerId },
            data: { status: 'REJECTED' },
        });

        res.json({
            message: 'Seller application rejected.',
        });
    }
    catch (error) {
        console.error(`Reject seller error: ${error} | from adminController`);
        res.status(500).json({ error: 'Failed to reject seller.' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, isActive, search } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {
            role: { not: 'ADMIN' },
        };

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    sellerProfile: {
                        select: {
                            id: true,
                            shopName: true,
                            status: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / take),
            },
        });
    }

    catch (error) {
        console.error(`Get all users error: ${error} | from adminController`);
        res.status(500).json({ error: 'Failed to get users.' });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        //ห้าม toggle ตัวเอง
        if (userId === req.user.id) {
            return res.status(400).json({ error: 'You cannot toggle your own account status.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, isActive: true, role: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        //ห้าม toggle admin อื่น
        if (user.role === 'ADMIN') {
            return res.status(403).json({ error: 'You cannot toggle another admin account.' });
        }

        const newStatus = !user.isActive;

        const updatedUser = await prisma.$transaction(async (tx) => {
            const updatedUserData = await tx.user.update({
                where: { id: userId },
                data: { isActive: newStatus },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    role: true,
                },
            });

            if (newStatus === false) {
                await tx.refreshToken.deleteMany({
                    where: { userId },
                });
            }

            return updatedUserData;

        });

        res.json({
            message: `User account ${updatedUser.isActive ? 'activated' : 'suspended'} successfully.`,
            user: updatedUser,
        });
    }
    
    catch (error) {
        console.error(`Toggle user status error: ${error} | from adminController`);
        res.status(500).json({ error: 'Failed to toggle user status.' });
    }
};