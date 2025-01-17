import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret: any = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!);

export async function POST(req: Request) {
  const body = await req.text();

  const signature: any = headers().get("stripe-signature");
  // const signature = req.headers.get("stripe-signature");

  let data;
  let eventType;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: "Webhook signature error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }

  data = event.data;
  eventType = event.type;

  console.log(data);

  // try {
  //   switch (eventType) {
  //     case "checkout.session.completed": {
  //       const session = await stripe.checkout.sessions.retrieve(
  //         data.object.id,
  //         {
  //           expand: ["line_items"],
  //         }
  //       );

  //       const customerId: any = session?.customer;
  //       const customer = await stripe.customers.retrieve(customerId);

  //       const priceId = session?.line_items?.data[0]?.price_id;
  //       const plan = plans.find((p: any) => p.priceId === priceId);

  //       if (!plan) break;

  //       let user;

  //       // check if user exists
  //       if (customer.email) {
  //       } else {
  //         console.error("Error finding user");
  //         throw new Error("Error finding user");
  //       }
  //     }

  //     case "customer.subscription.deleted": {
  //     }

  //     default:
  //     // unhandled event type
  //   }
  // } catch (error: any) {
  //   console.error(
  //     `Stripe error: ${error.message} | Event type: ${eventType} | `
  //   );
  // }

  //   try {
  //     return NextResponse.json();
  //   } catch (error) {
  //     console.error("Stripe webhook error:", error);
  //     return NextResponse.json(
  //       {
  //         error: "Stripe webhook error",
  //         details: error instanceof Error ? error.message : String(error),
  //       },
  //       { status: 500 }
  //     );
  //   }
}
