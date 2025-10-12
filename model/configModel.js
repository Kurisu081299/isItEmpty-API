const dbConn = require("../config/db.config");

const configModel = {};

// Fetch only the latest configuration record based on created_at
configModel.getCurrentConfig = (callback) => {
    const query = `
        SELECT *
        FROM system_config
        ORDER BY created_at DESC
        LIMIT 1
    `;

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching latest configuration from system_config.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};


// Insert new configuration record into system_config
configModel.insertConfig = (data, callback) => {
    const query = `
        INSERT INTO system_config 
        (room_number, lock_default_password, wifi_name, wifi_password, ip_address, first_name, last_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.room_number,
        data.lock_default_password,
        data.wifi_name || null,
        data.wifi_password || null,
        data.ip_address || null,
        data.first_name,
        data.last_name,
    ];

    dbConn.query(query, values, (error, result) => {
        if (error) {
            console.error("Error inserting into system_config.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

// Fetch all configuration logs (optional: from a separate logs table)
configModel.getAllLogs = (callback) => {
    const query = "SELECT * FROM system_config ORDER BY created_at DESC";

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching configuration logs.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

module.exports = configModel;
