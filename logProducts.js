/** @format */

import { getDBConnection } from "./db/db.js";

async function logProducts() {
  const db = await getDBConnection();

  try {
    const products = await db.all("SELECT * FROM products");
    console.table(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
  } finally {
    await db.close();
  }
}

logProducts();
