const client = require('../utils/db/index.js');


exports.createAppointment = (req, res) => {
  console.log(req.body)
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

exports.appointmentLists = async (req, res) =>{
 try {
  // couting total appointments
  const countAppointmentsQuery = 'SELECT COUNT(*) FROM appointments;';
  const countResult = await client.query(countAppointmentsQuery);
  const totalAppointments = parseInt(countResult.rows[0].count, 10);


  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const offset = (page -1) * pageSize; 
  const searchQuery = req.query.q || '';  

  
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
      patients.id AS patient_id
    FROM
      appointments
    INNER JOIN
      patients ON appointments.id = patients.appointment_id
    WHERE
      appointments.problem ILIKE $1 OR
      appointments.department ILIKE $1 OR
      appointments.doctor ILIKE $1 OR
      patients.patient_name_english ILIKE $1 OR
      patients.patient_name_bangla ILIKE $1 OR
      appointments.id::TEXT ILIKE $1 
    ORDER BY
      appointments.createdat DESC
    LIMIT $2 OFFSET $3;
  `;

  const values = [`%${searchQuery}%`, pageSize, offset];
const result = await client.query(getAppointmentsQuery, values);
  
 const appointments = result.rows;
  
 return res.status(200).json({
  totalAppointments, 
  appointments, 
  message: 'Success'
 });
} catch(error){
  console.error(error);
  return res.status(500).json({
    totalAppointments:0,
    appointments:[],
    message: 'Error Internal Server Error'
  })
}
}
exports.getAppointmentDetails = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    // console.log(appointmentId)
    const getAppointmentQuery = `
      SELECT
        appointments.id AS appointment_id,
        appointments.problem,
        appointments.department,
        appointments.doctor,
        appointments.arrival_date,
        appointments.arrival_time,
        appointments.createdAt AS appointment_created_at,
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
        patients ON appointments.id = patients.appointment_id
      WHERE
        appointments.id = $1;
    `;

    const result = await client.query(getAppointmentQuery, [appointmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointmentDetails = result.rows[0];

    return res.status(200).json({
      appointmentDetails,
      message: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error: Internal Server Error',
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const {
      problem,
      department,
      doctor,
      arrival_date,
      arrival_time,
      // status,  
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

    // Start a transaction
    await client.query('BEGIN');

    // Update appointment information in the Appointments table
    const updateAppointmentQuery = `
      UPDATE Appointments
      SET
        problem = $1,
        department = $2,
        doctor = $3,
        arrival_date = $4,
        arrival_time = $5
        WHERE id = $6
        RETURNING id;
        `;
        // status = $6

    const appointmentValues = [problem, department, doctor, arrival_date, arrival_time, id];

    const appointmentResult = await client.query(updateAppointmentQuery, appointmentValues);

    const updatedAppointmentId = appointmentResult.rows[0].id;

    // Update patient information in the Patients table
    const updatePatientQuery = `
      UPDATE Patients
      SET
        patient_name_english = $1,
        patient_name_bangla = $2,
        patient_father_name_english = $3,
        patient_father_name_bangla = $4,
        patient_mother_name_english = $5,
        patient_mother_name_bangla = $6,
        present_address = $7,
        permanent_address = $8,
        mobile_number = $9,
        email = $10,
        nid_or_birth_certificate_no = $11,
        sex = $12,
        age = $13,
        weight = $14
      WHERE appointment_id = $15
      RETURNING id;
    `;

    const patientValues = [
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
      updatedAppointmentId, // Use the updated appointment ID
    ];

    const patientResult = await client.query(updatePatientQuery, patientValues);

    // Commit the transaction
    await client.query('COMMIT');

    return res.status(200).json({ message: 'Appointment and patient information updated successfully' });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
