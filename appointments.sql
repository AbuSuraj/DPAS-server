CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    problem VARCHAR(255),
    department VARCHAR(255),
    doctor VARCHAR(255),
    arrival_date DATE,
    arrival_time TIME
);