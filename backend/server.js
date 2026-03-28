const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Admin Supabase client (uses SECRET key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// 🟢 Get all users
app.get("/admin/users", async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
});

// 🔴 Delete user
app.delete("/admin/users/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return res.status(500).json({ error });
  }

  res.json({ message: "User deleted successfully" });
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Admin backend running on http://localhost:5000");
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});