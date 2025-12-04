# Booking API

API for booking seats at events.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create database:
Execute SQL script from `init-db.sql` file

3. Configure environment variables:
Create `.env` file with the following parameters:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=booking_db
NODE_ENV=development
```

4. Run the application:
```bash
npm run start:dev
```

## API Endpoints

### Create Event

```bash
curl --location 'http://localhost:3000/api/events' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Rock Concert",
  "total_seats": 100
}'
```

### Reserve Seat

```bash
curl --location 'http://localhost:3000/api/bookings/reserve' \
--header 'Content-Type: application/json' \
--data '{
  "event_id": 1,
  "user_id": "user123"
}'
```

## Features

- One user cannot book the same event twice
- Seat availability check when booking
