// Mock database (replace with real DB later - PostgreSQL, MongoDB, etc.)
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: "pending" | "completed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "mpesa" | "card" | "whatsapp";
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store (replace with real database)
export const db = {
  products: [] as Product[],
  orders: [] as Order[],
};

export default db;
