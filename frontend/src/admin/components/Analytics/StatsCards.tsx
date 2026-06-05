import { TrendingUp, ShoppingCart, Users, DollarSign } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    todaySales: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: `KES ${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: "Today's Sales",
      value: `KES ${stats.todaySales.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-primary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
