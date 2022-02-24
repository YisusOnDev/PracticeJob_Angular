import { Company } from 'src/app/_models/company';
import { Province } from "./province";
import { Student } from './student';

export class PrivateMessage {
    message: string;
    studentId: number;
    student: Province;
    companyId: number;
    company: Company;

    constructor(message: string, studentId: number, student: Student, companyId: number, company: Company) {
        this.message = message;
        this.studentId = studentId;
        this.student = student;
        this.companyId = companyId;
        this.company = company;
    }
}