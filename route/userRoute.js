const express = require ('express');
const router = express.Router();
const userController = require('../controller/userController');

// list of routes
router.post("/register", userController.register);
router.get("/", userController.fetchAllUsers);
router.post("/:code", userController.fetchCode);
router.put("/update", userController.updateUser);

router.post("/login/signin", userController.checkUser);

module.exports = router;