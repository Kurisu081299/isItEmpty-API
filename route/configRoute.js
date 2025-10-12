const express = require ('express');
const router = express.Router();
const configController = require('../controller/configController');

// list of routes
router.post("/update", configController.updateConfig);
router.get("/", configController.getCurrentConfig);
router.get("/logs", configController.getAllLogs);

module.exports = router;