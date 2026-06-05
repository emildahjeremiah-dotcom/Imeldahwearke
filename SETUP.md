# ImeldahwearKE Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- M-Pesa Daraja API credentials from [Safaricom](https://developer.safaricom.co.ke)
- WhatsApp Business API access from [Meta](https://developers.facebook.com)

## Backend Setup

### 1. Clone and install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
# M-Pesa Credentials
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_ENV=sandbox
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback

# WhatsApp Credentials
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
```

### 3. Run the backend

```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Run the frontend

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Testing

### Test M-Pesa Payment

```bash
curl -X POST http://localhost:5000/api/payments/mpesa/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "phoneNumber": "254712345678",
    "orderId": "order-123"
  }'
```

### Test WhatsApp Notification

```bash
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678",
    "type": "order_created",
    "data": {
      "orderId": "order-123",
      "total": 5000,
      "itemCount": 3
    }
  }'
```

## Admin Dashboard

Access at `http://localhost:3000/admin`

**Default Credentials:**
- Email: `admin@imeldahwearke.com`
- Password: `AdminPassword123!`

## Local Webhook Testing

For testing M-Pesa callbacks locally, use ngrok:

```bash
ngrok http 5000
```

Update `MPESA_CALLBACK_URL` in `.env`:

```
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/payments/mpesa/callback
```

## Deployment

### Backend (Railway)

1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Connect repository to Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy

## Troubleshooting

### M-Pesa Issues

- Verify Consumer Key and Secret are correct
- Check if shortcode has sufficient float
- Ensure callback URL is publicly accessible
- Verify phone number format (254XXXXXXXXX)

### WhatsApp Issues

- Verify phone number ID and access token
- Check if number is registered in WhatsApp Manager
- Ensure message templates are approved (if using templates)
- Test with sandbox before production

## Next Steps

- [ ] Set up PostgreSQL database
- [ ] Add JWT authentication
- [ ] Implement rate limiting
- [ ] Set up error logging (Sentry)
- [ ] Add CI/CD pipeline
- [ ] Deploy to production
