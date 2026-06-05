import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="font-display font-bold text-5xl md:text-6xl mb-4">
          Hello Kitty Fashion<span className="text-primary">.</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Discover adorable Hello Kitty merchandise and fashion items. Show your love for the iconic character with our exclusive collection.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}
