const express = require('express');
const router = express.Router();
const {createAppointment, appointmentLists, getAppointmentDetails, updateAppointment } = require('../controllers/appointment.controller');


router.post('/',  createAppointment);
router.get('/',  appointmentLists);
router.get('/:id',  getAppointmentDetails);
router.patch('/:id',  updateAppointment);

module.exports = router;
