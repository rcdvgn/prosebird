import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/app/_config/stripe/stripe";
import { plans } from "@/app/_lib/plans";
import {
  handleSubscriptionDeletion,
  handleSubscriptionUpdate,
  updateCustomerSubscription,
} from "@/app/_services/server";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Webhook handler
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature error" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        console.log("Received checkout.session.completed event");
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          { expand: ["line_items"] }
        );

        const customerId = session.customer;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId found in session metadata");
          break;
        }

        const priceId = session.line_items?.data[0]?.price?.id;
        const plan = plans.find(
          (p: any) =>
            p.monthly.priceId === priceId || p.yearly.priceId === priceId
        );

        if (!plan) {
          console.error("No matching plan found for priceId:", priceId);
          break;
        }

        await updateCustomerSubscription(userId, {
          customerId: customerId,
          subscriptionStatus: "active",
          planName: plan.name,
        });
        break;

      case "customer.subscription.deleted":
        console.log("Received customer.subscription.deleted event");
        await handleSubscriptionDeletion(event.data.object.customer);
        break;

      case "customer.subscription.updated":
        console.log("Received customer.subscription.updated event");
        await handleSubscriptionUpdate(event.data.object);
        break;

      default:
        // console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing Stripe event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
