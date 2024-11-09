const express = require ('express');
const router = express.Router();
const userController = require('../controller/userController');

// list of routes
router.post("/register", userController.register);
router.get("/", userController.fetchAllUsers);
router.get("/:code", userController.fetchCode);
router.put("/update", userController.updateUser);

router.post("/login", userController.login);

module.exports = router;