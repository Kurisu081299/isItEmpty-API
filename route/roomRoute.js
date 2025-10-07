const express = require ('express');
const router = express.Router();
const multer = require('multer');
const roomController = require('../controller/roomController');

const upload = multer({ dest: 'uploads/' }); 

// list of routes
router.post("/insertroom", roomController.insertRoom);
router.get("/", roomController.getAllRooms);

router.post("/bulkupload", upload.single('file'), roomController.bulkUploadRooms);

module.exports = router;