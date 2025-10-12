const configModel = require("../model/configModel");

const configController = {};

// Controller: Get the most recent configuration record
configController.getCurrentConfig = (req, res) => {
    configModel.getCurrentConfig((error, result) => {
        if (error) {
            console.error("Error fetching latest configuration.", error);
            return res.status(500).json({ message: "Error fetching latest configuration." });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No configuration data found." });
        }

        return res.status(200).json({
            message: "Latest configuration fetched successfully.",
            data: result[0], // return only the single latest record
        });
    });
};


// Controller: Insert a new configuration record
configController.updateConfig = (req, res) => {  // same route name "/update" but now performs INSERT
    const {
        room_number,
        lock_default_password,
        wifi_name,
        wifi_password,
        ip_address,
        first_name,
        last_name
    } = req.body;

    // Required fields: room_number, lock_default_password, first_name, last_name
    if (!room_number || !lock_default_password || !first_name || !last_name) {
        return res.status(400).json({
            message: "Room number, lock default password, first name, and last name are required."
        });
    }

    const data = {
        room_number,
        lock_default_password,
        wifi_name: wifi_name || null,
        wifi_password: wifi_password || null,
        ip_address: ip_address || null,
        first_name,
        last_name,
    };

    configModel.insertConfig(data, (error, result) => {
        if (error) {
            console.error("Error inserting configuration.", error);
            return res.status(500).json({ message: "Error inserting configuration." });
        }

        return res.status(201).json({
            message: "Configuration inserted successfully.",
            insert_id: result.insertId,
        });
    });
};

// Controller: Get all logs
configController.getAllLogs = (req, res) => {
    configModel.getAllLogs((error, result) => {
        if (error) {
            console.error("Error fetching configuration logs.", error);
            return res.status(500).json({ message: "Error fetching configuration logs." });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No configuration logs found." });
        }

        return res.status(200).json({
            message: "Configuration logs fetched successfully.",
            data: result,
        });
    });
};

module.exports = configController;
