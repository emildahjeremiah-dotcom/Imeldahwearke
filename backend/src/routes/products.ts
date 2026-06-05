import express from "express";
import { ProductModel } from "../models/Product";

const router = express.Router();

// GET all products
router.get("/", (req, res) => {
  try {
    const { category } = req.query;
    let products = ProductModel.getAll();

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
});

// GET product by ID
router.get("/:id", (req, res) => {
  try {
    const product = ProductModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch product" });
  }
});

// POST create product (admin only - add auth later)
router.post("/", (req, res) => {
  try {
    const { name, price, description, category, image, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const product = ProductModel.create({
      name,
      price,
      description,
      category,
      image,
      stock: stock || 0,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create product" });
  }
});

// PATCH update product (admin only)
router.patch("/:id", (req, res) => {
  try {
    const product = ProductModel.update(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
});

// DELETE product (admin only)
router.delete("/:id", (req, res) => {
  try {
    const product = ProductModel.delete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted", data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete product" });
  }
});

export default router;
