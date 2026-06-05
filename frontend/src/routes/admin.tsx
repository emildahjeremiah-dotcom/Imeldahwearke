import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/admin/components/Layout/Layout'
import { StatsCards } from '@/admin/components/Analytics/StatsCards'
import { useOrders } from '@/admin/hooks/useOrders'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/admin')({component: AdminDashboard})

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  todaySales: number
}

function AdminDashboard() {
  const { orders } = useOrders()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todaySales: 0,
  })

  useEffect(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const pendingOrders = orders.filter((o) => o.status === 'pending').length

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaySales = orders
      .filter((o) => new Date(o.createdAt) >= today)
      .reduce((sum, o) => sum + o.total, 0)

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      todaySales,
    })
  }, [orders])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your store overview.</p>
        </div>

        <StatsCards stats={stats} />

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-4">Order ID</th>
                  <th className="text-left py-2 px-4">Customer</th>
                  <th className="text-left py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4 font-semibold">KES {order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
