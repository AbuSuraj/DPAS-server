const client = require('../utils/db/index.js');


exports.createAppointment = (req, res) => {
  const {
    problem,
    department,
    doctor,
    arrival_date,
    arrival_time,
    patient_name_english,
    patient_name_bangla,
    patient_father_name_english,
    patient_father_name_bangla,
    patient_mother_name_english,
    patient_mother_name_bangla,
    present_address,
    permanent_address,
    mobile_number,
    email,
    nid_or_birth_certificate_no,
    sex,
    age,
    weight,
  } = req.body;

  // Insert appointment information into the Appointments table
  const createAppointmentQuery = `
    INSERT INTO Appointments (problem, department, doctor, arrival_date, arrival_time, createdAt, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, createdAt;
  `;

  const appointmentValues = [problem, department, doctor, arrival_date, arrival_time, new Date(), "Submitted"];


  client.query(createAppointmentQuery, appointmentValues, (err, appointmentResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const { id, createdat } = appointmentResult.rows[0];
 
    // inserting patient info. into patinets table with appointment_id
    const createPatientQuery = `
      INSERT INTO Patients (appointment_id, patient_name_english, patient_name_bangla,
        patient_father_name_english, patient_father_name_bangla, patient_mother_name_english,
        patient_mother_name_bangla, present_address, permanent_address, mobile_number, email,
        nid_or_birth_certificate_no, sex, age, weight)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;

    const patientValues = [
        id,
      patient_name_english,
      patient_name_bangla,
      patient_father_name_english,
      patient_father_name_bangla,
      patient_mother_name_english,
      patient_mother_name_bangla,
      present_address,
      permanent_address,
      mobile_number,
      email,
      nid_or_birth_certificate_no,
      sex,
      age,
      weight,
    ];

    client.query(createPatientQuery, patientValues, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(201).json({ message: 'Appointment created successfully',  appointment: {
        id,
        createdat 
      } });
    });
  });
};
