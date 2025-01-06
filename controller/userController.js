const userModel = require ('../model/userModel');
const userController = {};

userController.register = (req, res) => {
    const { username, first_name, last_name, email_address, phone_number, code } = req.body;
    const data = { username, first_name, last_name, email_address, phone_number, code };

    // Check for unique fields first
    userModel.checkUniqueFields(data, (error, checkResult) => {
        if (error) {
            console.error("Error checking unique fields.", error);
            return res.status(500).json({ message: "Error checking unique fields." });
        }

        // If any unique field already exists, return the message
        if (checkResult.exists) {
            return res.status(400).json({ message: checkResult.message });
        }

        // If fields are unique, proceed with insertion
        userModel.register(data, (error, result) => {
            if (error) {
                console.error("Error inserting user.", error);
                return res.status(500).json({ message: "Error inserting user" });
            }
            return res.status(200).json({ message: "UserInserted Successfully" });
        });
    });
};

// Controller function to fetch all users
userController.fetchAllUsers = (req, res) => {
    userModel.getAllUsers((error, result) => {
        if (error) {
            console.error("Error fetching users.", error);
            return res.status(500).json({ message: "Error fetching users." });
        }
        return res.status(200).json(result);
    });
};

// Fetch user(s) by code
userController.fetchCode = (req, res) => {
    const { code } = req.params;

    userModel.getUserByCode(code, (error, result) => {
        if (error) {
            console.error("Error fetching user by code.", error);
            return res.status(500).json({ message: "Error fetching user by code." });
        }
        
        if (result.length === 0) {
            return res.status(401).json({ message: "Check credentials" });
        }
        
        return res.status(200).json(result);
    });
};

userController.updateUser = (req, res) => {
    const { code, user_type } = req.body;

    // Check if code and user_type are provided
    if (!code || !user_type) {
        return res.status(400).json({ message: "Code and user_type are required." });
    }

    userModel.updateUser(code, user_type, (error, result) => {
        if (error) {
            console.error("Error updating user type.", error);
            return res.status(500).json({ message: "Error updating user type." });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No user found with the provided code." });
        }
        
        return res.status(200).json({ message: "User type updated successfully." });
    });
};

// Controller function to check username and code for login
userController.checkUser = (req, res) => {
    const { username, user_code } = req.body;

    // Check if the username and code match in the database
    userModel.checkLogin(username, user_code, (error, result) => {
        if (error) {
            console.error("Error checking username and code.", error);
            return res.status(500).json({ message: "Error checking login credentials." });
        }

        // If username and code don't exist
        if (!result.exists) {
            return res.status(401).json({ message: "Check credentials" });
        }

        // If login is successful, return user data
        return res.status(200).json({
            message: "Login successful.",
            data: result.data  // Return user data
        });
    });
};

// Controller function to delete a user
userController.deleteUser = (req, res) => {
    const { username, code } = req.body;

    userModel.deleteUser(username, code, (error, result) => {
        if (error) {
            console.error("Error deleting user.", error);
            return res.status(500).json({ message: "Error deleting user." });
        }

        // If username and code don't match
        if (!result.exists) {
            return res.status(404).json({ message: "User not found or invalid credentials." });
        }

        // User successfully deleted
        return res.status(200).json({ message: "User successfully deleted." });
    });
};

module.exports = userController;