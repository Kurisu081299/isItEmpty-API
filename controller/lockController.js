const lockModel = require ('../model/lockModel');
const userModel = require ('../model/userModel');
const lockController = {};

lockController.insertStatus = (req, res) => {
    const { status, user_code, room_number } = req.body;

    // First, check if the user_code exists in the user table
    userModel.checkUserCode(user_code, (error, exists) => {
        if (error) {
            console.error("Error checking user code.", error);
            return res.status(500).json({ message: "Error checking user code." });
        }

        if (!exists) {
            return res.status(404).json({ message: "User code does not exist." });
        }

        // Check if the room_number exists in the room table
        lockModel.checkRoomExists(room_number, (error, roomExists) => {
            if (error) {
                console.error("Error checking room number.", error);
                return res.status(500).json({ message: "Error checking room number." });
            }

            if (!roomExists) {
                return res.status(404).json({ message: "Room doesn't exist." });
            }

            // If both checks pass, insert the data into the lock table
            const data = { status, user_code, room_number };

            lockModel.insertLock(data, (error, result) => {
                if (error) {
                    console.error("Error inserting into lock table.", error);
                    return res.status(500).json({ message: "Error inserting into lock table." });
                }

                // Assuming `result.insertId` contains the newly inserted lock's ID
                const lockId = result.insertId;
                return res.status(200).json({
                    message: "Data inserted into lock table successfully.",
                    lock_id: lockId,
                });
            });
        });
    });
};


// Controller function to update status in the lock table
lockController.statusUpdate = (req, res) => {
    const { lock_id, room_number, status } = req.body;

    // Ensure all necessary fields are provided
    if (!lock_id || !room_number || status === undefined) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    // Prepare data for the update query
    const data = { lock_id, room_number, status };

    // Call the model to perform the update
    lockModel.updateLockStatus(data, (error, result) => {
        if (error) {
            console.error("Error updating status in lock table.", error);
            return res.status(500).json({ message: "Error updating status." });
        }
        
        // If no rows were updated, that means the id and room_number didn't match
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No matching record found to update." });
        }

        return res.status(200).json({ message: "Status updated successfully." });
    });
};

// Controller function to fetch all data from lock_tbl with user information
lockController.getAll = (req, res) => {
    lockModel.getAllLockData((error, result) => {
        if (error) {
            console.error("Error fetching data from lock_tbl.", error);
            return res.status(500).json({ message: "Error fetching lock data" });
        }

        // If no data found
        if (result.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        return res.status(200).json({
            message: "Data fetched successfully",
            data: result
        });
    });
};

// Controller function to get the latest data for each room_number based on updated_at
lockController.getLatest = (req, res) => {
    lockModel.getLatestByRoom((error, result) => {
        if (error) {
            console.error("Error fetching latest information.", error);
            return res.status(500).json({ message: "Error fetching latest information." });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No data found." });
        }

        // Return the result with additional user information (first_name, last_name)
        return res.status(200).json({
            message: "Latest information fetched successfully.",
            data: result
        });
    });
};


module.exports = lockController;
