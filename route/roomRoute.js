const express = require ('express');
const router = express.Router();
const roomController = require('../controller/roomController');

// list of routes
router.post("/insertroom", roomController.insertRoom);
router.get("/", roomController.getAllRooms);

module.exports = router;