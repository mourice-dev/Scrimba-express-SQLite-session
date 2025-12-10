/** @format */

import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {

  try {
    const db = await getDBConnection();
    const productId = parseInt(req.body.productId, 10);

    if (isNaN(productId)) {
      await db.close();
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const userId = req.session.userId;
    if (!userId) {
      await db.close();
      return res.status(401).json({ error: "User not logged in" });
    }

    const existing = await db.get(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing) {
      await db.run(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?",
        [existing.id]
      );
    } else {
      await db.run(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
        [userId, productId]
      );
    }
    
    await db.close();
    res.json({ message: 'Added to cart' });

  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
