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


// // Function to get all data from rooms_tbl
// roomModel.getAllRooms = (callback) => {
//     const query = "SELECT * FROM rooms_tbl";  // Query to get all rooms data

//     dbConn.query(query, (error, result) => {
//         if (error) {
//             console.error("Error fetching data from rooms_tbl.", error);
//             return callback(error, null);
//         }

//         return callback(null, result);  // Return result to the controller
//     });
// };

// Function to get all data from rooms_tbl with the latest lock_tbl data and user details
roomModel.getAllRooms = (callback) => {
    const query = `
        SELECT 
            r.id AS room_id, 
            r.room_number, 
            r.created_at AS room_created_at, 
            r.updated_at AS room_updated_at,
            l.id AS lock_id,
            l.status,
            l.user_code AS user_code,
         
            l.created_at AS lock_created_at,
            l.updated_at AS lock_updated_at,
            CONCAT(u.first_name, ' ', u.last_name) AS user_full_name
        FROM 
            rooms_tbl r
        LEFT JOIN (
            SELECT 
                id, 
                status, 
                user_code, 
                room_number, 
                created_at, 
                updated_at
            FROM 
                lock_tbl 
            WHERE 
                (room_number, updated_at) IN (
                    SELECT 
                        room_number, 
                        MAX(updated_at) 
                    FROM 
                        lock_tbl 
                    GROUP BY 
                        room_number
                )
        ) l 
        ON 
            r.room_number = l.room_number
        LEFT JOIN 
            users u 
        ON 
            l.user_code = u.code
    `;

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching data from rooms_tbl, lock_tbl, and users.", error);
            return callback(error, null);
        }

        return callback(null, result); // Return the result to the controller
    });
};

roomModel.getRoomLogs = (callback) => {
    const query = "SELECT * FROM logs";

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching data from logs table.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};


module.exports = roomModel;
