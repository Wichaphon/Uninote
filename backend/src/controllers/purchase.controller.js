import prisma from "../lib/prisma.js";
import stripe from "../lib/stripe.js";
import { FRONTEND_URL } from "../config/env.js";
import cloudinary from "../lib/cloudinary.js";

export const createPurchase = async (req, res) => {

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