/** @format */

import { getDBConnection } from "../db/db.js";

export async function getCurrentUser(req, res) {
  try {
    if (!req.session.userId) {
      return res.json({ isLoggedIn: false });
    }

    const db = await getDBConnection();
    const user = await db.get("SELECT name FROM users WHERE id = ? ", [
      req.session.userId,
    ]);
    await db.close();

    if (!user) {
      return res.json({ isLoggedIn: false });
    }

    res.json({ isLoggedIn: true, name: user.name });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
