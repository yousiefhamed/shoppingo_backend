const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class StudentsManager {
  constructor() {
    this.students = [];
    this.studentsFilePath = path.join(__dirname, "students.json");
  }

  // create

  async saveStudents() {
    try {
      const studentsJson = JSON.stringify(this.students);
      await fs.writeFile(this.studentsFilePath, studentsJson);
    } catch (error) {
      console.log(error);
    }
  }

  // read
  async loadStudents() {
    try {
      const list = await fs.readFile(this.studentsFilePath, "utf8");
      this.students = JSON.parse(list);
    } catch (error) {
      console.log(error);
    }
  }

  async createStudent(student) {
    await this.loadStudents();
    const newStudent = {
      ...student,
      id: uuidv4(),
    };
    this.students.push(newStudent);
    await this.saveStudents();
    return newStudent;
  }

  async getStudents() {
    await this.loadStudents();
    return this.students;
  }

  async getStudentById(id) {
    await this.loadStudents();
    const studentObj = this.students.find((student) => {
      return student.id.toString() === id.toString();
    });
    if (!studentObj) {
      throw new Error("Student not found");
    }
    return studentObj;
  }

  async filterStudent(ageStart, ageEnd) {
    await this.loadStudents();
    const fiteredStudents = this.students.filter(
      (student) => student.age >= ageStart && student.age <= ageEnd
    );
    if (fiteredStudents.length === 0) {
      throw new Error("No students found with given age range");
    }
    return fiteredStudents;
  }

  async updateStudent(id, updatedStudent) {
    await this.loadStudents();
    const index = this.students.findIndex(
      (student) => student.id.toString() === id.toString()
    );
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...updatedStudent };
    await this.saveStudents();
    return this.students[index];
  }

  async deleteStudent(id) {
    await this.loadStudents();
    const index = this.students.findIndex(
      (student) => student.id.toString() === id.toString()
    );
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students.splice(index, 1);
    await this.saveStudents();
    return "success";
  }
}

module.exports = StudentsManager;
