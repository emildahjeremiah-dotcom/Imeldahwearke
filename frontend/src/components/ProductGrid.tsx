import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { useCart } from '@/lib/cart'

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Hello Kitty Plush Toy',
    price: 2500,
    image: 'https://via.placeholder.com/300x300?text=Hello+Kitty+Plush',
    category: 'Toys',
    description: 'Soft and cuddly Hello Kitty plush toy',
  },
  {
    id: '2',
    name: 'Pink Hello Kitty T-Shirt',
    price: 1500,
    image: 'https://via.placeholder.com/300x300?text=Hello+Kitty+Tee',
    category: 'Clothing',
    description: 'Comfortable cotton Hello Kitty t-shirt',
  },
  {
    id: '3',
    name: 'Hello Kitty Backpack',
    price: 3500,
    image: 'https://via.placeholder.com/300x300?text=Hello+Kitty+Backpack',
    category: 'Accessories',
    description: 'Stylish school backpack with Hello Kitty design',
  },
  {
    id: '4',
    name: 'Hello Kitty Mug',
    price: 800,
    image: 'https://via.placeholder.com/300x300?text=Hello+Kitty+Mug',
    category: 'Home',
    description: 'Perfect for morning coffee or tea',
  },
  {
    id: '5',
    name: 'Hello Kitty Phone Case',
    price: 1200,
    image: 'https://via.placeholder.com/300x300?text=Hello+Kitty+Phone',
    category: 'Tech',
    description: 'Protect your phone with style',
  },
  {
    id: '6',
    name: 'Hello Kitty Sticker Pack',
    price: 500,
    image: 'https://via.placeholder.com/300x300?text=Hello+Kitty+Stickers',
    category: 'Stationery',
    description: 'Fun decorative stickers',
  },
]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { addToCart } = useCart()

  const categories = ['All', ...new Set(MOCK_PRODUCTS.map((p) => p.category))]

  const filteredProducts = selectedCategory === 'All' || !selectedCategory
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.category === selectedCategory)

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display font-bold text-4xl mb-4 text-center">Our Collection</h2>
        <p className="text-gray-600 text-center mb-8">Browse our exclusive Hello Kitty items</p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                (selectedCategory === category || (!selectedCategory && category === 'All'))
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
