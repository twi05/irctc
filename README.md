# Railway Management System

## Overview

This project is a railway management system developed using Node.js, Express.js, and MySQL. It provides functionalities for users to register, book seats on trains, view seat availability, and retrieve booking details. The system also includes an admin role for managing trains and seat allocations.

## Assumptions

- Each train has a fixed number of seats.
- Booking can only be made for the entire journey from the start station to the end station.
- Only registered users can book seats.
- Admins have access to additional functionalities such as adding trains and updating seat capacities.
- Race conditions during seat booking are handled at the database level to ensure data consistency.

## Database Schema

### Users Table

- `user_id` (Primary Key, Auto-increment)
- `username` (Unique)
- `password`
- `role` (Enum: 'admin', 'user')

### Trains Table

- `train_id` (Primary Key, Auto-increment)
- `source`
- `destination`

### Train Seats Table

- `seat_id` (Primary Key, Auto-increment)
- `train_id` (Foreign Key referencing `trains.train_id`)
- `seats_remaining`

### Bookings Table

- `booking_id` (Primary Key, Auto-increment)
- `user_id` (Foreign Key referencing `users.user_id`)
- `train_id` (Foreign Key referencing `trains.train_id`)
- `seat_number`
- `booking_date` (Timestamp)

## SQL Queries

-- Create the users table to store user information
CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each user
username VARCHAR(255) UNIQUE, -- Username for login
password VARCHAR(255), -- Password for login
role ENUM('admin', 'user') -- Role of the user (admin or regular user)
);

-- Create the trains table to store information about trains
CREATE TABLE trains (
train_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each train
source VARCHAR(255), -- Source station of the train journey
destination VARCHAR(255) -- Destination station of the train journey
);

-- Create the train_seats table to track seat availability for each train
CREATE TABLE train_seats (
seat_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each seat
train_id INT NOT NULL, -- Foreign key referencing the trains table
seats_remaining INT NOT NULL, -- Number of remaining seats on the train
FOREIGN KEY (train_id) REFERENCES trains(train_id) -- Reference to the train this seat belongs to
);

-- Create the bookings table to track user bookings
CREATE TABLE bookings (
booking_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each booking
username INT NOT NULL, -- Foreign key referencing the users table
train_id INT NOT NULL, -- Foreign key referencing the trains table
seat_number INT NOT NULL, -- Seat number booked by the user
booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of booking
FOREIGN KEY (username) REFERENCES users(username), -- Reference to the user who made the booking
FOREIGN KEY (train_id) REFERENCES trains(train_id) -- Reference to the train booked by the user
);



### Register a User:
INSERT INTO users (username, password, role) VALUES (?, ?, ?);


### Add a New Train:
INSERT INTO trains (source, destination) VALUES (?, ?);


### Get Seat Availability:
SELECT ts.train_id, t.source, t.destination, ts.seats_remaining
FROM train_seats ts
INNER JOIN trains t ON ts.train_id = t.train_id
WHERE t.source = ? AND t.destination = ?;


### Book a Seat:
INSERT INTO bookings (user_id, train_id, seat_number) VALUES (?, ?, ?);


### Get Booking Details:
SELECT b.booking_id, u.username, t.source, t.destination, b.booking_date, ts.seat_number
FROM bookings b
INNER JOIN users u ON b.user_id = u.user_id
INNER JOIN trains t ON b.train_id = t.train_id
INNER JOIN train_seats ts ON b.train_id = ts.train_id AND b.seat_number = ts.seat_id
WHERE b.user_id = ?;


### Get Booked Seats for a Specific User:
SELECT seat_number FROM bookings WHERE user_id = ?;


### Get Booked Seats for a Specific Train:
SELECT seat_number FROM bookings WHERE train_id = ?;

### Users Table

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user')
);


### Trains Table

CREATE TABLE trains (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255),
    destination VARCHAR(255)
);


### Train Seats Table

CREATE TABLE train_seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    seats_remaining INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(train_id)
);


### Bookings Table

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    seat_number INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (train_id) REFERENCES trains(train_id)
);

Usage
Clone the repository.
Install dependencies using npm install.
Set up the MySQL database and configure the connection in the application.
Run the application using npm start.
Access the application via the provided endpoints.
Endpoints
/register: Register a new user.
/login: Log in to an existing account.
/addTrain: Add a new train to the system.
/getSeatAvailability: Get seat availability for trains between specific stations.
/bookSeat: Book a seat on a particular train.
/bookingDetails/:userId: Get booking details for a specific user.
```
