// userModel.js
const dbConn = require("../config/db.config"); // Database connection
const userModel = {};

// Function to check if any of the unique fields already exist
userModel.checkUniqueFields = (data, callback) => {
    const { username, email_address, phone_number, code } = data;

    const query = `
        SELECT * FROM users 
        WHERE username = ? OR email_address = ? OR phone_number = ? OR code = ?
    `;

    dbConn.query(query, [username, email_address, phone_number, code], (error, results) => {
        if (error) {
            console.error("Error checking unique fields.", error);
            return callback(error, null);
        }

        if (results.length > 0) {
            let message = "";
            results.forEach((row) => {
                if (row.code === code) message = "Code already exists. Try another.";
                else if (row.username === username) message = "Username already exists. Try another.";
                else if (row.email_address === email_address) message = "Email address already exists. Try another.";
                else if (row.phone_number === phone_number) message = "Phone number already exists. Try another.";
            });
            return callback(null, { exists: true, message });
        }

        return callback(null, { exists: false });
    });
};

// Function to insert a new user
userModel.register = (data, callback) => {
    // First, check if any of the fields already exist
    userModel.checkUniqueFields(data, (error, checkResult) => {
        if (error) {
            return callback(error, null);
        }

        if (checkResult.exists) {
            return callback(null, { message: checkResult.message });
        }

        // If fields are unique, proceed with insertion
        const query = `
            INSERT INTO users (username, first_name, last_name, email_address, phone_number, code)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        dbConn.query(query, [data.username, data.first_name, data.last_name, data.email_address, data.phone_number, data.code], (error, result) => {
            if (error) {
                console.error("Error inserting user.", error);
                return callback(error, null);
            }
            return callback(null, { message: "User Inserted Successfully", result });
        });
    });
};

// Function to get all users from the database
userModel.getAllUsers = (callback) => {
    const query = "SELECT * FROM users";

    dbConn.query(query, (error, result) => {
        if (error) {
            console.error("Error fetching users from the database.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

// Get user(s) by code
userModel.getUserByCode = (code, callback) => {
    const query = "SELECT * FROM users WHERE code = ?";

    dbConn.query(query, [code], (error, result) => {
        if (error) {
            console.error("Error fetching user by code from the database.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

// Model function to update user_type by code
userModel.updateUser = (code, user_type, callback) => {
    const query = "UPDATE users SET user_type = ? WHERE code = ?";

    dbConn.query(query, [user_type, code], (error, result) => {
        if (error) {
            console.error("Error updating user type in the database.", error);
            return callback(error, null);
        }
        return callback(null, result);
    });
};

userModel.checkUserCode = (user_code, callback) => {
    const query = "SELECT * FROM users WHERE code = ?";

    dbConn.query(query, [user_code], (error, results) => {
        if (error) {
            console.error("Error checking user code in the database.", error);
            return callback(error, null);
        }
        
        // Check if any record was found
        const exists = results.length > 0;
        return callback(null, exists);
    });
};

// Function to check if the username and code exist in the users table
userModel.checkLogin = (username, code, callback) => {
    const query = "SELECT * FROM users WHERE username = ? AND code = ?";
    const values = [username, code]; // Use input parameters

    dbConn.query(query, values, (error, result) => {
        if (error) {
            console.error("Error checking username and code.", error);
            return callback(error, null);
        }

        // Check if user exists
        if (result.length === 0) {
            return callback(null, { exists: false });
        }

        // Return user data if exists
        return callback(null, { exists: true, data: result[0] });
    });
};


// Function to delete the user from the database
userModel.deleteUser = (username, code, callback) => {
    if (!username || !code) {
        console.error("Username or code is missing.");
        return callback(new Error("Username or code is required."), null);
    }

    const query = "DELETE FROM users WHERE username = ? AND code = ?";
    const values = [username, code];

    dbConn.query(query, values, (error, result) => {
        if (error) {
            console.error("Error deleting user.", error);
            return callback(error, null);
        }

        // Check if a row was affected
        if (result.affectedRows === 0) {
            return callback(null, { exists: false });
        }

        // Deletion was successful
        return callback(null, { exists: true });
    });
};

module.exports = userModel;
