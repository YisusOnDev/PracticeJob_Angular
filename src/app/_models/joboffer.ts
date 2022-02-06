import { Company } from "./company";
import { FP } from "./fp";
import { Student } from "./student";

export enum ApplicationStatus {
    Pending,
    Accepted,
    Declined
}

export class JobOffer {
    id?: number;
    companyId: number;
    company: Company;
    name: string;
    description: string;
    remuneration: number;
    schedule?: string;
    startDate: Date;
    endDate: Date;
    fPs: FP[];
    jobApplications?: JobApplication[];

    constructor(name: string, companyId: number, company: Company, description: string, remuneration: number, startDate: Date, endDate: Date, fps: FP[], jobApplications?: JobApplication[], schedule?: string, id?: number,) {
        if (id != undefined) {
            this.id = id
        }
        this.companyId = companyId
        this.company = company
        this.name = name
        this.description = description
        this.remuneration = remuneration
        this.startDate = startDate
        this.endDate = endDate
        this.fPs = fps
        if (jobApplications != undefined) {
            this.jobApplications = jobApplications;
        }
        if (schedule != undefined) {
            this.schedule = schedule
        }
    }
}

export class JobApplication {
    id?: number;
    studentId: number;
    student: Student;
    jobOfferId: number;
    jobOffer: JobOffer;
    applicationDate: Date;
    applicationStatus: ApplicationStatus;

    constructor(studentId: number, student: Student, jobOfferId: number, jobOffer: JobOffer, applicationDate: Date, applicationStatus: ApplicationStatus, id?: number) {
        if (id != undefined) {
            this.id = id
        }
        this.studentId = studentId
        this.student = student
        this.jobOfferId = jobOfferId
        this.jobOffer = jobOffer
        this.applicationDate = applicationDate
        this.applicationStatus = applicationStatus
    }
}