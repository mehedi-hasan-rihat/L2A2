# Vehicle Rental System API

## Live URL
[[#](https://rental-system-blue.vercel.app/)]

## Features
- User authentication (JWT-based)
- Role-based access control (Admin & Customer)
- Vehicle management (CRUD operations)
- Booking system with availability validation
- Automatic price calculation based on rental duration
- Auto-return expired bookings
- Customer booking cancellation (before start date)
- Admin booking management

## Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd L2A2
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
PORT=5000
CONNECTION_STR=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server
```bash
npm run dev
```

The server will run at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Vehicles
- `GET /api/v1/vehicles` - Get all vehicles
- `GET /api/v1/vehicles/:id` - Get vehicle by ID
- `POST /api/v1/vehicles` - Create vehicle (Admin only)
- `PUT /api/v1/vehicles/:id` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:id` - Delete vehicle (Admin only)

### Bookings
- `POST /api/v1/bookings` - Create booking (Customer/Admin)
- `GET /api/v1/bookings` - Get bookings (Admin: all, Customer: own)
- `PUT /api/v1/bookings/:bookingId` - Update booking (Customer: cancel, Admin: mark returned)

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Usage

### Register a User
```bash
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

### Create a Booking
```bash
POST /api/v1/bookings
Authorization: Bearer <token>
{
  "customer_id": 1,
  "vehicle_id": 1,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

## Database Schema

### Users
- id, name, email, password, phone, role

### Vehicles
- id, vehicle_name, type, registration_number, daily_rent_price, availability_status

### Bookings
- id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
