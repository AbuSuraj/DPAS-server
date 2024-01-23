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

exports.appointmentLists = (req, res) =>{
    const getAppointmentsQuery = `
    SELECT
      appointments.id AS appointment_id,
      appointments.problem,
      appointments.department,
      appointments.doctor,
      appointments.arrival_date,
      appointments.arrival_time,
      appointments.createdAt,
      appointments.status,
      patients.id AS patient_id,
      patients.patient_name_english,
      patients.patient_name_bangla,
      patients.patient_father_name_english,
      patients.patient_father_name_bangla,
      patients.patient_mother_name_english,
      patients.patient_mother_name_bangla,
      patients.present_address,
      patients.permanent_address,
      patients.mobile_number,
      patients.email,
      patients.nid_or_birth_certificate_no,
      patients.sex,
      patients.age,
      patients.weight
    FROM
       appointments
    INNER JOIN
       patients ON appointments.id = patients.appointment_id;
  `;

  client.query(getAppointmentsQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const appointments = result.rows;
    return res.status(200).json({ appointments });
  });

}