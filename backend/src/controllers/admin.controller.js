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