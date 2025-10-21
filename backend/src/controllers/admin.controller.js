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