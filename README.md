1) npm install

2) create db
check \booking-api\init-db.sql

3) configure .env
.env example
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
NODE_ENV=

4) create event
curl --location 'http://localhost:3000/api/events' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Rock Concert",
  "total_seats": 100
}'

5) seat reservation
curl --location 'http://localhost:3000/api/bookings/reserve' \
--header 'Content-Type: application/json' \
--data '{
  "event_id": 1,
  "user_id": "user123"
}'