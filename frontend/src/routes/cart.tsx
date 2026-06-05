import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartPage } from '@/components/CartPage'

export const Route = createFileRoute('/cart')({component: Cart})

function Cart() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <CartPage />
      <Footer />
    </div>
  )
}
