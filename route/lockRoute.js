const express = require ('express');
const router = express.Router();
const lockController = require('../controller/lockController');

// list of routes
router.post("/insert", lockController.insertStatus);
router.put("/statusupdate", lockController.statusUpdate);
router.get("/information", lockController.getAll);
router.get("/latestinformation", lockController.getLatest);

module.exports = router;