const { get } = require("../routes/registerRoutes");
const pool = require("../utils/connection");

const registerUser = ({ username, password, role }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const getUserByName = (username) => {
  let sql = "SELECT * FROM users WHERE username = ?;";
  return new Promise((resolve, reject) => {
    pool.query(sql, username, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const addNewTrain = ({ source, destination }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO trains (source, destination) VALUES (?, ?)",
      [source, destination],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Get Seat Availability
const getSeatAvailability = (source, destination) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT t.source, t.destination, ts.seats_remaining FROM trains t INNER JOIN train_seats ts ON t.train_id = ts.train_id WHERE t.source = ? AND t.destination = ?",
      [source, destination],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};
// Get Booking Details
const getBookingDetails = (username) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT b.booking_id, u.username, t.source, t.destination, b.booking_date, ts.seat_number FROM bookings b INNER JOIN users u ON b.user_id = u.user_id INNER JOIN trains t ON b.train_id = t.train_id INNER JOIN train_seats ts ON b.train_id = ts.train_id AND b.seat_number = ts.seat_id WHERE b.user_id = ?",
      [username],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Function to book a seat on a train
const bookSeat = (userId, trainId, seatNumber) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        connection.beginTransaction((transactionError) => {
          if (transactionError) {
            connection.release();
            reject(transactionError);
          } else {
            // Check if there are available seats remaining on the train
            connection.query(
              "SELECT seats_remaining FROM train_seats WHERE train_id = ? FOR UPDATE",
              [trainId],
              (availabilityError, availabilityResults) => {
                if (availabilityError) {
                  connection.release();
                  reject(availabilityError);
                } else {
                  const seatsRemaining = availabilityResults[0].seats_remaining;
                  if (seatsRemaining <= 0) {
                    connection.release();
                    reject("No available seats remaining on the train.");
                  } else {
                    // Proceed with booking the seat
                    connection.query(
                      "INSERT INTO bookings (user_id, train_id, booking_date) VALUES (?, ?, ?)",
                      [userId, trainId, new Date()],
                      (insertError, insertResults) => {
                        if (insertError) {
                          connection.rollback(() => {
                            connection.release();
                            reject(insertError);
                          });
                        } else {
                          connection.query(
                            "UPDATE train_seats SET seats_remaining = seats_remaining - 1 WHERE train_id = ?",
                            [trainId + "1"],
                            (updateError, updateResults) => {
                              if (updateError) {
                                connection.rollback(() => {
                                  connection.release();
                                  reject(updateError);
                                });
                              } else {
                                connection.commit((commitError) => {
                                  if (commitError) {
                                    connection.rollback(() => {
                                      connection.release();
                                      reject(commitError);
                                    });
                                  } else {
                                    connection.release();
                                    resolve(insertResults);
                                  }
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        });
      }
    });
  });
};

// Function to get booked seats for a specific train
const getBookedSeats = (trainId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT seat_number FROM bookings WHERE train_id = ?",
      [trainId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const bookedSeats = results.map((result) => result.seat_number);
          resolve(bookedSeats);
        }
      }
    );
  });
};
// Function to get booked seats for a specific user
const getBookedSeatsByuserName = (userName) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT seat_number FROM bookings WHERE user_id = ?",
      [userName],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const bookedSeats = results.map((result) => result.seat_number);
          resolve(bookedSeats);
        }
      }
    );
  });
};

module.exports = {
  registerUser,
  getUserByName,
  bookSeat,
  addNewTrain,
  getBookingDetails,
  getSeatAvailability,
  getBookedSeats,
  getBookedSeatsByuserName,
};
