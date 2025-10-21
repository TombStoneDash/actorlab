import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
async function buffer(readable:any){const chunks:Buffer[]=[];for await(const c of readable){chunks.push(typeof c==="string"?Buffer.from(c):c)}return Buffer.concat(chunks)}
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).end();
  try{
    const sig=req.headers["stripe-signature"]; const buf=await buffer(req);
    const event=stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    switch(event.type){
      case "checkout.session.completed": { const s=event.data.object as any; const email=s.customer_details?.email; if(email){ await supabase.from("users").upsert({ email, subscription_status:"active", tier:"pro" }); } break; }
      case "customer.subscription.deleted": { const sub=event.data.object as any; const cust=sub.customer as string; await supabase.from("users").update({subscription_status:"canceled", tier:"free"}).eq("stripe_customer_id", cust); break; }
      default: console.log("Unhandled", event.type);
    }
    res.status(200).json({received:true});
  }catch(e:any){ console.error(e); res.status(400).send(`Webhook Error: ${e.message}`); }
}
