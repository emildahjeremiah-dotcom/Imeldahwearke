# ImeldahwearKE 💕

> Hello Kitty & All Things Cute - E-commerce Store

A full-featured e-commerce platform built with React, Node.js, M-Pesa integration, and WhatsApp order notifications.

## Features

✅ **Product Catalog** - Browse Hello Kitty products by category
✅ **Shopping Cart** - Add/remove items with real-time updates
✅ **M-Pesa Payments** - Secure payment processing via Safaricom Daraja API
✅ **WhatsApp Notifications** - Order confirmations, payment updates, shipping notifications
✅ **Admin Dashboard** - Complete order and customer management system
✅ **Order Tracking** - Real-time order status updates
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
✅ **Accessibility** - WCAG compliant with keyboard navigation

## Tech Stack

### Frontend
- **React 18** - UI library
- **TanStack React Router** - Routing and navigation
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client

### Integrations
- **M-Pesa Daraja API** - Payment processing
- **WhatsApp Cloud API** - Order notifications
- **Twilio WhatsApp** - Alternative notification provider

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── hooks/
│   │   └── lib/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- M-Pesa Daraja API credentials
- WhatsApp Business API access

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - List all orders (admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### Payments
- `POST /api/payments/mpesa/initiate` - Initiate M-Pesa STK push
- `POST /api/payments/mpesa/callback` - M-Pesa callback handler
- `POST /api/payments/mpesa/query` - Query payment status

### Notifications
- `POST /api/notifications/send` - Send notification
- `POST /api/notifications/promo` - Send promo messages
- `POST /api/notifications/retry` - Retry failed notifications
- `GET /api/notifications` - Get notification history

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard-stats` - Dashboard statistics

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development

# M-Pesa
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_ENV=sandbox
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback

# WhatsApp (Meta Cloud API)
WHATSAPP_PHONE_NUMBER_ID=your_number_id
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
WHATSAPP_VERIFY_TOKEN=your_verify_token

# WhatsApp (Twilio Alternative)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# General
WHATSAPP_NUMBER=254700000000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/imeldahwearke
```

## Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin`

**Default Credentials:**
- Email: `admin@imeldahwearke.com`
- Password: `AdminPassword123!`

## Features Breakdown

### Customer Features
- Browse products by category
- Add/remove items from cart
- M-Pesa payment checkout
- Order tracking
- WhatsApp support

### Admin Features
- Dashboard with key metrics
- Order management (view, filter, update status)
- Customer management (view order history)
- Product management (CRUD operations)
- WhatsApp bulk notifications
- Notification history logs

## Payment Flow

1. Customer adds items to cart
2. Checkout with phone number
3. Order created in system
4. M-Pesa STK push initiated
5. Customer enters PIN
6. Payment confirmed
7. WhatsApp notification sent
8. Order marked as completed
9. Shipping notifications sent

## WhatsApp Notifications

Customers receive automated messages for:
- ✅ Order confirmation
- ✅ Payment received
- ✅ Order shipped
- ✅ Delivery confirmation
- 📢 Promotional offers
- 💬 Support responses

## Development

### Code Style
- TypeScript for type safety
- ESLint for linting
- Prettier for formatting
- Tailwind CSS for styling

### Git Workflow
```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

## Deployment

### Frontend
- **Vercel** - Recommended for Next.js/React
- **Netlify** - Alternative option

### Backend
- **Railway** - Easy deployment
- **Render** - Alternative option
- **AWS/DigitalOcean** - For production scale

## Database

Currently using in-memory storage. For production:

```bash
npm install @prisma/client prisma
npx prisma init
npm run prisma:migrate
```

## Security Considerations

- ✅ M-Pesa credentials stored in .env
- ✅ WhatsApp tokens secured
- ✅ Phone number formatting validated
- ✅ HTTPS enforced for callbacks
- ⚠️ TODO: JWT authentication for admin
- ⚠️ TODO: Rate limiting on API endpoints
- ⚠️ TODO: Input validation and sanitization
- ⚠️ TODO: CORS configuration

## Testing

### Manual Testing
1. Use ngrok for local webhook testing
2. Test M-Pesa in sandbox mode
3. Test WhatsApp with business test numbers

```bash
ngrok http 5000
```

## Troubleshooting

### M-Pesa Issues
- Verify credentials are correct
- Check if shortcode has sufficient float
- Ensure callback URL is publicly accessible
- Check timestamp and password encoding

### WhatsApp Issues
- Verify phone number format (254XXXXXXXXX)
- Check access token validity
- Ensure webhook URL is reachable
- Verify message template is approved (if using templates)

## Support

📧 Email: hello@imeldahwearke.com
💬 WhatsApp: [Your WhatsApp number]
🐦 Twitter: @imeldahwearke
📸 Instagram: @imeldahwearke

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## Roadmap

- [ ] PostgreSQL database integration with Prisma
- [ ] JWT authentication for admin
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Inventory management
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Multiple payment methods (Stripe, AirtelMoney)
- [ ] Analytics and reporting
- [ ] Customer loyalty program

---

Made with 💕 for Hello Kitty fans in Kenya
