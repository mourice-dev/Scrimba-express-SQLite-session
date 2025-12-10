/** @format */

import { getDBConnection } from "./db/db.js";

async function listTables() {
  const db = await getDBConnection();
  const tables = await db.all(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  console.log("Tables:", tables);
  await db.close();
}

listTables();
