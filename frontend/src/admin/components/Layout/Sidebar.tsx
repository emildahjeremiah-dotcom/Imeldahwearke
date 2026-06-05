import { BarChart3, ShoppingCart, Package, Users, MessageSquare, Settings, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { label: 'Dashboard', icon: BarChart3, href: '/admin' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Customers', icon: Users, href: '/admin/customers' },
  { label: 'Notifications', icon: MessageSquare, href: '/admin/notifications' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white z-40 transform transition-transform md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <h2 className="font-display font-bold text-lg">ImeldahwearKE</h2>
          <button onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
