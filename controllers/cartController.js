/** @format */

import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {
  const db = await getDBConnection();

  const productId = parseInt(req.body.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const userId = req.session.userId;

  const existing = await db.get(
    "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );

  if (existing) {
    await db.run("UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?", [
      existing.id,
    ]);
  } else {
    await db.run(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
      [userId, productId]
    );
  }

  res.json({ message: "Added to cart" });
}

export async function getCartCount(req, res) {
  try {
    const db = await getDBConnection();
    const userId = req.session.userId;

    if (!userId) {
      await db.close();
      return res.json({ totalItems: 0 });
    }

    const result = await db.get(
      "SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id = ?",
      [userId]
    );

    await db.close();

    const count = result?.totalItems || 0;
    return res.json({ totalItems: count });
  } catch (err) {
    console.error("getCartCount error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAll(req, res) {
  // Don't touch this code!
  if (!req.session.userId) {
    return res.json({ err: "not logged in" });
  }

  try {
    const db = await getDBConnection();

    const items = await db.all(
      `SELECT 
        cart_items.id AS cartItemId,
        cart_items.quantity,
        products.title,
        products.artist,
        products.price
       FROM cart_items
       JOIN products ON cart_items.product_id = products.id
       WHERE cart_items.user_id = ?`,
      [req.session.userId]
    );

    await db.close();

    res.json({ items: items });
  } catch (err) {
    console.error("getAll error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

  /*
Challenge: 

1. When a logged-in user clicks the cart icon, they will be redirected to the cart.html page.
 To render the user's cart, the frontend needs to get an array of objects similar to the example 
 below when it makes a GET request to the /api/cart endpoint. Important: this array should be sent
 in a JSON object with the key 'items'.

[
  {
    cartItemId: 4,
    quantity: 2,
    title: 'Selling Dogma',
    artist: 'The Clouds',
    price: 44.99
  },
  {
    cartItemId: 5,
    quantity: 1,
    title: 'Midnight Parallels',
    artist: 'Neon Grove',
    price: 40.99
  }
]

The frontend JS has been done for you.

Ignore frontend console errors for now!
 
For testing, log in with:
Username: test
Password: test

Then click the cart icon to go to the cart page. You should see the user’s items.

Loads of help in hint.md
*/
}

// /** @format */

// import { getDBConnection } from "../db/db.js";

// export async function addToCart(req, res) {
//   try {
//     const db = await getDBConnection();
//     const productId = parseInt(req.body.productId, 10);

//     if (isNaN(productId)) {
//       await db.close();
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     const userId = req.session.userId;
//     if (!userId) {
//       await db.close();
//       return res.status(401).json({ error: "User not logged in" });
//     }

//     const existing = await db.get(
//       "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
//       [userId, productId]
//     );

//     if (existing) {
//       await db.run(
//         "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?",
//         [existing.id]
//       );
//     } else {
//       await db.run(
//         "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
//         [userId, productId]
//       );
//     }

//     await db.close();
//     res.json({ message: "Added to cart" });
//   } catch (err) {
//     console.error("addToCart error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// export async function getCartCount(req, res) {
//   try {
//     const db = await getDBConnection();

//     if (!user_id) {
//       await db.close();
//       return res.json({ totalItems: 0 });
//     }

//     const result = await db.get(
//       "SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id = ?",
//       [req.session.userId]
//     );

//     await db.close();

//     return res.json({ totalItems: result.totalItems || 0 });
//   } catch (err) {
//     console.error("getCartCount error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
//   // *
//   // Challenge:

//   // 1. Write code to ensure that when a logged-in user clicks 'Add to Cart', their current
//   //  cart count is shown in the header with a cart icon. The frontend has been done for you.
//   //  All the backend need do is provide the following JSON on the /api/cart/cart-count endpoint:
//   // { <THE TOTAL NUMBER OF THE USER'S ITEMS> || 0 }

//   // Ignore frontend console errors for now!

//   // For testing, log in with:
//   // Username: test
//   // Password: test

//   // Loads of help in hint.md
//   // */
// }
