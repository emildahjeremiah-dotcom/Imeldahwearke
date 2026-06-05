import { v4 as uuidv4 } from "uuid";
import db, { Order } from "../config/database";

export const OrderModel = {
  create: (data: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const order: Order = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.orders.push(order);
    return order;
  },

  getAll: () => db.orders,

  getById: (id: string) => db.orders.find((o) => o.id === id),

  getByCustomerEmail: (email: string) => db.orders.filter((o) => o.customerEmail === email),

  update: (id: string, data: Partial<Order>) => {
    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    db.orders[index] = {
      ...db.orders[index],
      ...data,
      updatedAt: new Date(),
    };
    return db.orders[index];
  },

  delete: (id: string) => {
    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const deleted = db.orders[index];
    db.orders.splice(index, 1);
    return deleted;
  },
};
