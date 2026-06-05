import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { PaymentModal } from './PaymentModal'

export function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const [showPayment, setShowPayment] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display font-bold text-2xl mb-2">Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some cute Hello Kitty items!</p>
        <Link
          to="/"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
      <h1 className="font-display font-bold text-3xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">KES {item.price}/each</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg mb-2">KES {(item.price * item.quantity).toLocaleString()}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">KES {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">-</span>
            </div>
          </div>

          <div className="flex justify-between mb-6 text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary">KES {total.toLocaleString()}</span>
          </div>

          {/* Customer Info */}
          <div className="space-y-3 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Phone (254712345678)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={() => {
              if (!customerEmail || !customerPhone) {
                alert('Please enter email and phone')
                return
              }
              setShowPayment(true)
            }}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition mb-2"
          >
            Proceed to Payment
          </button>

          <button
            onClick={() => {
              clearCart()
              setShowPayment(false)
            }}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        items={items}
      />
    </div>
  )
}
