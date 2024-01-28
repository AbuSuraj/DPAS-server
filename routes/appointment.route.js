const express = require('express');
const router = express.Router();
const {createAppointment, appointmentLists, getAppointmentDetails } = require('../controllers/appointment.controller');


router.post('/',  createAppointment);
router.get('/',  appointmentLists);
router.get('/:id',  getAppointmentDetails);

module.exports = router;
