import { db } from "@/db/client";
import { users } from "@/db/schema";

async function main() {
  const rows = await db.select().from(users);
  console.table(rows.map((u) => ({ id: u.id, email: u.email, name: u.name })));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
