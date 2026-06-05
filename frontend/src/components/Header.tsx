import { Link } from '@tanstack/react-router'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl">💕</div>
          <span className="font-display font-bold text-xl text-primary">ImeldahwearKE</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-primary transition">
            Home
          </Link>
          <Link to="/" className="text-gray-700 hover:text-primary transition">
            Products
          </Link>
          <Link to="/" className="text-gray-700 hover:text-primary transition">
            About
          </Link>
          <Link to="/" className="text-gray-700 hover:text-primary transition">
            Contact
          </Link>
        </nav>

        {/* Cart & Admin */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          <Link
            to="/admin"
            className="hidden md:block text-xs bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Admin
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link to="/" className="text-gray-700 hover:text-primary">
              Products
            </Link>
            <Link to="/" className="text-gray-700 hover:text-primary">
              About
            </Link>
            <Link to="/" className="text-gray-700 hover:text-primary">
              Contact
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-primary">
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
