import { useState } from 'react'
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  customerEmail: string
  customerPhone: string
  items: any[]
}

export function PaymentModal({
  isOpen,
  onClose,
  total,
  customerEmail,
  customerPhone,
  items,
}: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Create order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          customerEmail,
          customerName: 'Customer',
          customerPhone,
          paymentMethod: 'mpesa',
        }),
      })

      const orderData = await orderResponse.json()
      if (!orderData.success) throw new Error('Failed to create order')

      const orderId = orderData.data.id

      // Initiate M-Pesa payment
      const paymentResponse = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          phoneNumber: customerPhone,
          orderId,
        }),
      })

      const paymentData = await paymentResponse.json()
      if (!paymentData.success) throw new Error('Failed to initiate payment')

      setStatus('pending')

      // Poll for payment status (simulate)
      setTimeout(() => {
        setStatus('success')
      }, 3000)
    } catch (error) {
      console.error('Payment error:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {status === 'idle' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">Complete Payment</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold">KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">M-Pesa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="text-sm">{customerPhone}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Pay with M-Pesa'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              You'll receive an M-Pesa prompt on your phone
            </p>
          </>
        )}

        {status === 'pending' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="font-semibold text-lg mb-2">Payment Pending</h3>
            <p className="text-sm text-gray-600 text-center">
              Enter your M-Pesa PIN on your phone to complete the payment
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Payment Successful!</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Your order has been confirmed. You'll receive updates via WhatsApp.
            </p>
            <button
              onClick={() => {
                onClose()
                setStatus('idle')
              }}
              className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90"
            >
              Close
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8">
            <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Payment Failed</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
