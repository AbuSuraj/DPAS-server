const express = require('express');
const router = express.Router();
const {createAppointment, appointmentLists } = require('../controllers/appointment.controller');


router.post('/',  createAppointment);
router.get('/',  appointmentLists);

module.exports = router;
