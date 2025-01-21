import { NextResponse } from "next/server";
import stripe from "@/app/_config/stripe/stripe";
import { getBaseUrl } from "@/app/_lib/baseUrl";

export async function POST(req: Request) {
  try {
    const { userId, customerId, customerEmail, priceId } = await req.json();

    if (!userId || !priceId || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    if (customerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: getBaseUrl(),
      });
      return NextResponse.json({ url: stripeSession.url });
    }

    // Create the Stripe Checkout Session
    const session = await createCheckoutSession(userId, priceId, customerEmail);

    // Return the session URL to redirect the user
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

async function createCheckoutSession(
  userId: string,
  priceId: string,
  customerEmail: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: getBaseUrl(),
      cancel_url: getBaseUrl(), // Replace with your actual cancel URL
      metadata: {
        userId: userId, // Associate the session with your app's user
      },
    });

    // console.log("Checkout session created:", session);
    return session;
  } catch (error) {
    console.error("Error creating Stripe Checkout Session:", error);
    throw error;
  }
}
