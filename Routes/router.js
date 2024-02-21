const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");


router.post("/user/register",controllers.userregister);
router.post("/user/sendotp",controllers.userOtpSend);
router.post("/user/login",controllers.userLogin);
router.post("/api/send-reminder", controllers.sendWeeklyReminder);


module.exports = router;