const express = require("express");
const router = express.Router();
const ajv = require("ajv");

const StudentsManager = require("./studentsManager");
const studentsManager = new StudentsManager();

const studentSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      default: new Date().getTime() + Math.floor(Math.random() * 100),
    },
    name: { type: "string" },
    birthDate: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    enrolledCourses: { type: "array", items: { type: "string" } },
    grade: { type: "string" },
  },
  required: ["name", "birthDate"],
  additionalProperties: false,
};

const validateStudent = new ajv().compile(studentSchema);

router.get("/", async (req, res) => {
  if (req.query.ageStart && req.query.ageEnd) {
    const { ageStart, ageEnd } = req.query;
    const filteredStudents = await studentsManager.filterStudent(
      ageStart,
      ageEnd
    );
    res.json(filteredStudents);
  } else {
    const studentsList = await studentsManager.getStudents();
    res.json(studentsList);
  }
});

router.get("/:id", async (req, res) => {
  const student = await studentsManager.getStudentById(req.params.id);
  res.json(student);
});

router.post("/", async (req, res) => {
  if (!validateStudent(req.body)) {
    return res.status(400).json({ errors: validateStudent.errors });
  }
  const student = await studentsManager.createStudent(req.body);
  res.json(student);
});

router.put("/:id", async (req, res) => {
  const updatedStudent = await studentsManager.updateStudent(
    req.params.id,
    req.body
  );
  res.json(updatedStudent);
});

router.delete("/:id", async (req, res) => {
  const result = await studentsManager.deleteStudent(req.params.id);
  res.json(result);
});

module.exports = router;
