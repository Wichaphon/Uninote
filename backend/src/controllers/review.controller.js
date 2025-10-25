import prisma from "../lib/prisma.js";

export const rateSheet = async (req, res) => {
    try {
        const { sheetId } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        }

        const sheet = await prisma.sheet.findUnique({
            where: { id: sheetId },
        });

        if (!sheet) {
            return res.status(404).json({ error: 'Sheet not found.' });
        }


        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_sheetId: {
                    userId: req.user.id,
                    sheetId,
                },
            },
        });

        if (!purchase || purchase.status !== 'COMPLETED') {
            return res.status(403).json({
                error: 'You must purchase this sheet before rating it.'
            });
        }

        const [review, stats] = await prisma.$transaction(async (tx) => {

            const upsertedReview = await tx.review.upsert({
                where: {
                    userId_sheetId: { userId: req.user.id, sheetId },
                },
                update: { rating: parseInt(rating) },
                create: {
                    userId: req.user.id,
                    sheetId,
                    rating: parseInt(rating),
                },
            });

            const aggregateStats = await tx.review.aggregate({
                where: { sheetId },
                _avg: { rating: true },
                _count: { _all: true },
            });

            const reviewCount = aggregateStats._count._all;
            const averageRating = aggregateStats._avg.rating;

            await tx.sheet.update({
                where: { id: sheetId },
                data: {
                    averageRating: averageRating,
                    reviewCount: reviewCount,
                },
            });

            return [upsertedReview, { averageRating, reviewCount }];
        });

        res.json({
            message: review.updatedAt > review.createdAt
                ? 'Rating updated successfully.'
                : 'Rating submitted successfully.',
            review,
            averageRating: stats.averageRating,
            reviewCount: stats.reviewCount,
        });
    }
    catch (error) {
        console.error(`Rate sheet error: ${error} | from reviewController`);
        res.status(500).json({ error: 'Failed to rate sheet.' });
    }
};