import { createClient } from "@supabase/supabase-js"; import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const users=[{email:"free.actor@example.com",subscription_status:"free",tier:"free"},{email:"pro.actor@example.com",subscription_status:"active",tier:"pro"}];
const run=async()=>{const {data,error}=await supabase.from("users").upsert(users); if(error) throw error; console.log(data)}; run().catch(e=>{console.error(e);process.exit(1)});
