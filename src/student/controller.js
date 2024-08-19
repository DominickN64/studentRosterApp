const pool = require("../../db");
const queries = require("./queries");

const getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    if (error) throw error;

    res.status(200).json(results.rows);
  });
};

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentById, [id], (error, results) => {
    if (error) throw error;

    if (results.rows.length === 0) {
      // If no rows are returned, the student was not found
      return res.status(404).send(`Student with ID ${id} not found`);
    }

    res.status(200).json(results.rows);
  });
};

const addStudent = (req, res) => {
  const { name, email, age, dob } = req.body;

  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (results.rows.length) {
      return res.status(400).send("Email already exists");
    }

    pool.query(
      queries.addStudent,
      [name, email, age, dob],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Database query failed" });
        }
        res.status(201).send("Student created sucesfully");
      }
    );
  });
};

const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.removeStudent, [id], (error, results) => {
    if (results.rowCount === 0) {
      return res.status(404).send("Student does not exist in the database");
    }

    res.status(200).send("Student removed successfully");
  });
};

const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  pool.query(queries.getStudentById, [id], (error, results) => {
    if (results.rows.length === 0) {
      // If no rows are returned, the student was not found
      return res.status(404).send("Student does not exist in the database");
    }

    pool.query(queries.updateStudent, [name, id], (error, results) => {
      if (error) throw error;
      res.status(200).send("student updated sucessfully");
    });
  });
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  deleteStudent,
  updateStudent,
};
