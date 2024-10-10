import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

// config({ path: ".env" }) // or .env.local
console.log(process.env.DATABASE_URL)
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)
