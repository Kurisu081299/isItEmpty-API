// lockModel.js
const dbConn = require("../config/db.config");

const lockModel = {};

// Function to check if room_number exists in the room table
lockModel.checkRoomExists = (room_number, callback) => {
    const query = "SELECT * FROM rooms_tbl WHERE room_number = ?";
    
    dbConn.query(query, [room_number], (error, result) => {
        if (error) {
            console.error("Error checking room number.", error);
            return callback(error, null);
        }

        if (result.length === 0) {
            return callback(null, false);  // Room doesn't exist
        }

        return callback(null, true);  // Room exists
    });
};

// Function to insert into the lock table
lockModel.insertLock = (data, callback) => {
    const query = "INSERT INTO lock_tbl (status, user_code, room_number) VALUES (?, ?, ?)";
    const values = [data.status, data.user_code, data.room_number];

    dbConn.query(query, values, (error, result) => {
        if (error) {
            console.error("Error inserting into lock table.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

// Function to update the status in the lock table
lockModel.updateLockStatus = (data, callback) => {
    const query = "UPDATE lock_tbl SET status = ? WHERE id = ? AND room_number = ?";
    const values = [data.status, data.lock_id, data.room_number];

    dbConn.query(query, values, (error, result) => {
        if (error) {
            console.error("Error updating status in lock table.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

// Function to fetch all data from lock_tbl with first_name and last_name from users table
lockModel.getAllLockData = (callback) => {
    const query = `
        SELECT 
            lock_tbl.id AS lock_id, 
            lock_tbl.status, 
            lock_tbl.user_code, 
            lock_tbl.room_number, 
            lock_tbl.updated_at, 
            users.first_name, 
            users.last_name
        FROM lock_tbl
        JOIN users ON lock_tbl.user_code = users.code
    `;

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching data from lock_tbl.", error);
            return callback(error, null);
        }

        return callback(null, result);  // Return result to controller
    });
};

// Function to get the latest data based on the updated_at column for each room_number
lockModel.getLatestByRoom = (callback) => {
    const query = `
        SELECT 
            lock_tbl.id AS lock_id, 
            lock_tbl.status, 
            lock_tbl.user_code, 
            lock_tbl.room_number, 
            lock_tbl.updated_at, 
            users.first_name, 
            users.last_name
        FROM lock_tbl
        JOIN users ON lock_tbl.user_code = users.code
        WHERE (lock_tbl.room_number, lock_tbl.updated_at) IN (
            SELECT room_number, MAX(updated_at)
            FROM lock_tbl
            GROUP BY room_number
        )
    `;

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error getting latest data by room number.", error);
            return callback(error, null);
        }
        
        // Debugging: Check if there is any data
        console.log("Fetched result:", result);
        
        return callback(null, result);
    });
};


module.exports = lockModel;
