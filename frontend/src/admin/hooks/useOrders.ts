import { useState } from 'react'

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  items: OrderItem[]
  customerEmail: string
  customerName: string
  customerPhone: string
  total: number
  status: 'pending' | 'completed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'mpesa' | 'card' | 'whatsapp'
  createdAt: Date
  updatedAt: Date
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      // Mock implementation
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: status as Order['status'] } : o
        )
      )
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to update order' }
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to delete order' }
    }
  }

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    deleteOrder,
  }
}
