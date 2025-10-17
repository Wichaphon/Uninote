import prisma from "../lib/prisma.js";
import stripe from "../lib/stripe.js";
import { FRONTEND_URL } from "../config/env.js";
import cloudinary from "../lib/cloudinary.js";

export const createPurchase = async (req, res) => {
    try {
        const { sheetId } = req.params;
        const userId = req.user.id;

        const sheet = await prisma.sheet.findUnique({ where: { id: sheetId } });

        if (!sheet) return res.status(404).json({ error: 'Sheet not found.' });
        if (!sheet.isActive) return res.status(400).json({ error: 'This sheet is no longer available.' });
        if (sheet.sellerId === userId) return res.status(400).json({ error: 'You cannot purchase your own sheet.' });

        const existingPurchase = await prisma.purchase.findUnique({
            where: { userId_sheetId: { userId, sheetId } },
        });

        if (existingPurchase && existingPurchase.status === 'COMPLETED') {
            return res.status(400).json({ error: 'You have already purchased this sheet.' });
        }
    
        //สร้างใบสั่งซื้อ สถานะ PENDING 
        //ถ้ามีใบเก่าที่ FAILED หรือ PENDING อยู่แล้ว ให้ใช้ใบเดิม ไม่ต้องสร้างใหม่
        const purchase = existingPurchase 
            ? await prisma.purchase.update({
                where: { id: existingPurchase.id },
                data: { price: sheet.price } 
            })
            : await prisma.purchase.create({
                data: {
                    userId,
                    sheetId,
                    price: sheet.price,
                    status: 'PENDING',
                },
            });

        //สร้าง Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'promptpay'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/sheets/${sheetId}`,
            customer_email: req.user.email,
            line_items: [{
                price_data: {
                    currency: 'thb',
                    product_data: {
                        name: sheet.title,
                        description: sheet.description,
                        images: sheet.thumbnailUrl ? [sheet.thumbnailUrl] : [],
                    },
                    unit_amount: Math.round(parseFloat(sheet.price) * 100),
                },
                quantity: 1,
            }],
            metadata: {
                purchaseId: purchase.id, //ใช้ ID จากใบสั่งซื้อที่สร้าง
                sheetId: sheet.id,
                userId: userId,
            },
        });

        const updatedPurchase = await prisma.purchase.update({
            where: { id: purchase.id },
            data: { stripeSessionId: session.id },
        });

        res.json({
            message: 'Checkout session created successfully.',
            checkoutUrl: session.url,
            purchase: updatedPurchase,
        });

    } 
    catch (error) {
        console.error(`Create purchase error: ${error} | from purchaseController`);
        res.status(500).json({ error: 'Failed to create purchase.' });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            //อัปเดทสถานะเป็น COMPLETED
            await prisma.purchase.update({
                where: { stripeSessionId: session.id },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                    stripePaymentIntentId: session.payment_intent,
                },
            });

            //เพิ่ม purchaseCount ใน sheet
            await prisma.sheet.update({
                where: { id: session.metadata.sheetId },
                data: { purchaseCount: { increment: 1 } },
            });

            console.log(`Payment successful for session: ${session.id}`);
            break;

        case 'checkout.session.expired':
            const expiredSession = event.data.object;

            //อัปเดทสถานะเป็น FAILED 
            await prisma.purchase.update({
                where: { stripeSessionId: expiredSession.id },
                data: { status: 'FAILED' },
            });

            console.log(`Checkout session expired: ${expiredSession.id}`);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};