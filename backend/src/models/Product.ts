import { v4 as uuidv4 } from "uuid";
import db, { Product } from "../config/database";

export const ProductModel = {
  create: (data: Omit<Product, "id" | "createdAt">) => {
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    };
    db.products.push(product);
    return product;
  },

  getAll: () => db.products,

  getById: (id: string) => db.products.find((p) => p.id === id),

  getByCategory: (category: string) => db.products.filter((p) => p.category === category),

  update: (id: string, data: Partial<Product>) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    db.products[index] = { ...db.products[index], ...data };
    return db.products[index];
  },

  delete: (id: string) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const deleted = db.products[index];
    db.products.splice(index, 1);
    return deleted;
  },
};
