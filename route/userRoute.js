const express = require ('express');
const router = express.Router();
const userController = require('../controller/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// list of routes
router.post("/register", userController.register);
router.get("/", userController.fetchAllUsers);

router.put("/update", userController.updateUser);

router.post("/login/signin", userController.checkUser);

router.delete("/delete", userController.deleteUser);

router.post("/bulkupload", upload.single('userFile'), userController.bulkUploadUsers);

router.post("/:code", userController.fetchCode);

module.exports = router;