// roomModel.js
const dbConn = require("../config/db.config");
const roomModel = {};

// Function to check if room_number already exists
roomModel.checkRoomExists = (room_number, callback) => {
    const query = "SELECT * FROM rooms_tbl WHERE room_number = ?";
    dbConn.query(query, [room_number], (error, result) => {
        if (error) {
            console.error("Error checking room number existence.", error);
            return callback(error, null);
        }

        if (result.length > 0) {
            // Room number already exists
            return callback(null, true);
        }
        // Room number doesn't exist
        return callback(null, false);
    });
};

// Function to insert a new room into rooms_tbl
roomModel.insertRoom = (data, callback) => {
    const query = "INSERT INTO rooms_tbl (room_number) VALUES (?)";
    const values = [data.room_number];

    dbConn.query(query, values, (error, result) => {
        if (error) {
            console.error("Error inserting into rooms_tbl.", error);
            return callback(error, null);
        }
        return callback(null, result);  // Return the result to the controller
    });
};


// Function to get all data from rooms_tbl
roomModel.getAllRooms = (callback) => {
    const query = "SELECT * FROM rooms_tbl";  // Query to get all rooms data

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching data from rooms_tbl.", error);
            return callback(error, null);
        }

        return callback(null, result);  // Return result to the controller
    });
};

module.exports = roomModel;
