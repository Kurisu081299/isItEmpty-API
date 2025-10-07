// roomController.js
const fs = require('fs');
const csv = require('csv-parser');
const roomModel = require("../model/roomModel");
const roomController = {}

// Controller function to insert a new room into rooms_tbl
roomController.insertRoom = (req, res) => {
    const { room_number } = req.body;

    // Check if room_number is provided
    if (!room_number) {
        return res.status(400).json({ message: "Room number is required." });
    }

    // Check if the room number already exists in the rooms_tbl
    roomModel.checkRoomExists(room_number, (error, exists) => {
        if (error) {
            console.error("Error checking if room exists.", error);
            return res.status(500).json({ message: "Error checking room number." });
        }

        if (exists) {
            // If the room number already exists, return an error message
            return res.status(400).json({ message: "Room number already exists." });
        }

        // If room number doesn't exist, proceed to insert the new room
        const data = { room_number };

        roomModel.insertRoom(data, (error, result) => {
            if (error) {
                console.error("Error inserting room into rooms_tbl.", error);
                return res.status(500).json({ message: "Error inserting room" });
            }

            return res.status(200).json({
                message: "Room inserted successfully",
                room_id: result.insertId  // Optionally include the inserted ID
            });
        });
    });
};

// // Controller function to fetch all data from rooms_tbl
// roomController.getAllRooms = (req, res) => {
//     roomModel.getAllRooms((error, result) => {
//         if (error) {
//             console.error("Error fetching rooms data.", error);
//             return res.status(500).json({ message: "Error fetching rooms data." });
//         }

//         // If no data found
//         if (result.length === 0) {
//             return res.status(404).json({ message: "No rooms found." });
//         }

//         // Return the result
//         return res.status(200).json({
//             message: "Rooms data fetched successfully.",
//             data: result
//         });
//     });
// };

// Controller function to fetch all data from rooms_tbl with the latest lock data
roomController.getAllRooms = (req, res) => {
    roomModel.getAllRooms((error, result) => {
        if (error) {
            console.error("Error fetching rooms and lock data.", error);
            return res.status(500).json({ message: "Error fetching rooms and lock data." });
        }

        // If no data found
        if (result.length === 0) {
            return res.status(404).json({ message: "No rooms found." });
        }

        // Return the result
        return res.status(200).json({
            message: "Rooms and lock data fetched successfully.",
            data: result,
        });
    });
};

roomController.bulkUploadRooms = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded." });
    }

    const filePath = req.file.path;
    const insertedRooms = [];
    const duplicateRooms = [];
    const failedRooms = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const room_number = row.room_number;

            if (room_number) {
                roomModel.checkRoomExists(room_number, (err, exists) => {
                    if (err) {
                        failedRooms.push({ room_number, error: "Check error" });
                        return;
                    }

                    if (!exists) {
                        roomModel.insertRoom({ room_number }, (err, result) => {
                            if (err) {
                                failedRooms.push({ room_number, error: "Insert error" });
                            } else {
                                insertedRooms.push(room_number);
                            }
                        });
                    } else {
                        duplicateRooms.push(room_number);
                    }
                });
            } else {
                failedRooms.push({ room_number: "empty", error: "Missing room_number" });
            }
        })
        .on('end', () => {
            setTimeout(() => { // Wait a bit for async DB calls to finish
                fs.unlinkSync(filePath); // Clean up uploaded file
                return res.status(200).json({
                    message: "Bulk upload processed.",
                    inserted: insertedRooms,
                    duplicates: duplicateRooms,
                    failed: failedRooms
                });
            }, 1000);
        });
};

module.exports = roomController;
