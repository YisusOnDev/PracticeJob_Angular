import { Company } from "./company";
import { FP } from "./FP";

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

    constructor(name: string, companyId: number, company: Company, description: string, remuneration: number, startDate: Date, endDate: Date, fps: FP[], schedule?: string, id?: number,) {
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
        if (schedule != undefined) {
            this.schedule = schedule
        }
    }
}