import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import morgan from "morgan";
// import dotenv from "dotenv";

// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use("/public", express.static(path.join(__dirname, "public")));

// SQLite database connection
const db = await open({
  filename: "./pizza.sqlite",
  driver: sqlite3.Database,
});

// Routes
app.get("/api/pizzas", async (req, res) => {
  const pizzas = await db.all(`
    SELECT pizza_type_id, name, category, ingredients AS description FROM pizza_types
  `);
  const pizzaSizes = await db.all(`
    SELECT pizza_type_id AS id, size, price FROM pizzas
  `);

  const response = pizzas.map((pizza) => {
    const sizes = {};
    pizzaSizes
      .filter((s) => s.id === pizza.pizza_type_id)
      .forEach((s) => (sizes[s.size] = +s.price));

    return {
      id: pizza.pizza_type_id,
      name: pizza.name,
      category: pizza.category,
      description: pizza.description,
      image: `/public/pizzas/${pizza.pizza_type_id}.webp`,
      sizes,
    };
  });

  res.json(response);
});

app.get("/api/pizza-of-the-day", async (req, res) => {
  const pizzas = await db.all(`
    SELECT pizza_type_id AS id, name, category, ingredients AS description FROM pizza_types
  `);

  const index = Math.floor(Date.now() / 86400000) % pizzas.length;
  const pizza = pizzas[index];

  const sizes = await db.all(
    `
    SELECT size, price FROM pizzas WHERE pizza_type_id = ?
  `,
    [pizza.id]
  );

  const sizesObj = {};
  sizes.forEach((s) => (sizesObj[s.size] = +s.price));

  res.json({
    ...pizza,
    image: `/public/pizzas/${pizza.id}.webp`,
    sizes: sizesObj,
  });
});

app.get("/api/orders", async (req, res) => {
  const orders = await db.all(`SELECT order_id, date, time FROM orders`);
  res.json(orders);
});

app.get("/api/order", async (req, res) => {
  const { id } = req.query;

  const order = await db.get(
    `SELECT order_id, date, time FROM orders WHERE order_id = ?`,
    [id]
  );

  const orderItems = await db.all(
    `
    SELECT 
      t.pizza_type_id AS pizzaTypeId, t.name, t.category, t.ingredients AS description,
      o.quantity, p.price, o.quantity * p.price AS total, p.size
    FROM order_details o
    JOIN pizzas p ON o.pizza_id = p.pizza_id
    JOIN pizza_types t ON p.pizza_type_id = t.pizza_type_id
    WHERE o.order_id = ?
  `,
    [id]
  );

  const formatted = orderItems.map((item) => ({
    ...item,
    image: `/public/pizzas/${item.pizzaTypeId}.webp`,
    quantity: +item.quantity,
    price: +item.price,
  }));

  const total = formatted.reduce((acc, i) => acc + i.total, 0);

  res.json({ order: { ...order, total }, orderItems: formatted });
});

app.post("/api/order", async (req, res) => {
  const { cart } = req.body;

  if (!cart?.length)
    return res.status(400).json({ error: "Invalid order data" });

  const date = new Date();
  const orderDate = date.toISOString().split("T")[0];
  const orderTime = date.toTimeString().split(" ")[0];

  const tx = await db.exec("BEGIN TRANSACTION");

  try {
    const { lastID: orderId } = await db.run(
      `INSERT INTO orders (date, time) VALUES (?, ?)`,
      [orderDate, orderTime]
    );

    const merged = cart.reduce((acc, item) => {
      const pizzaId = `${item.pizza.id}_${item.size.toLowerCase()}`;
      if (!acc[pizzaId]) acc[pizzaId] = { pizzaId, quantity: 1 };
      else acc[pizzaId].quantity++;
      return acc;
    }, {});

    for (const { pizzaId, quantity } of Object.values(merged)) {
      await db.run(
        `INSERT INTO order_details (order_id, pizza_id, quantity) VALUES (?, ?, ?)`,
        [orderId, pizzaId, quantity]
      );
    }

    await db.exec("COMMIT");
    res.json({ orderId });
  } catch (err) {
    console.error(err);
    await db.exec("ROLLBACK");
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/past-orders", async (req, res) => {
  // await new Promise((r) => setTimeout(r, 5000));

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const pastOrders = await db.all(
      `
      SELECT order_id, date, time FROM orders
      ORDER BY order_id DESC
      LIMIT 10 OFFSET ?
    `,
      [offset]
    );

    res.json(pastOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch past orders" });
  }
});

app.get("/api/past-order/:order_id", async (req, res) => {
  const orderId = req.params.order_id;

  const order = await db.get(
    `SELECT order_id, date, time FROM orders WHERE order_id = ?`,
    [orderId]
  );
  if (!order) return res.status(404).json({ error: "Order not found" });

  const items = await db.all(
    `
    SELECT 
      t.pizza_type_id AS pizzaTypeId, t.name, t.category, t.ingredients AS description,
      o.quantity, p.price, o.quantity * p.price AS total, p.size
    FROM order_details o
    JOIN pizzas p ON o.pizza_id = p.pizza_id
    JOIN pizza_types t ON p.pizza_type_id = t.pizza_type_id
    WHERE o.order_id = ?
  `,
    [orderId]
  );

  const formatted = items.map((item) => ({
    ...item,
    image: `/public/pizzas/${item.pizzaTypeId}.webp`,
    quantity: +item.quantity,
    price: +item.price,
  }));

  const total = formatted.reduce((acc, item) => acc + item.total, 0);

  res.json({ order: { ...order, total }, orderItems: formatted });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log(`Contact form submission: ${name}, ${email}, ${message}`);
  res.json({ success: "Message received" });
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
