import { FP } from "./FP";

export class JobOffer {
    id?: number;
    name: string;
    description: string;
    remuneration: number;
    schedule?: string;
    startDate: Date;
    endDate: Date;
    fps: FP[];

    constructor(name: string, description: string, remuneration: number, startDate: Date, endDate: Date, fps: FP[], schedule?: string, id?: number,) {
        if (id != undefined) {
            this.id = id
        }
        this.name = name
        this.description = description
        this.remuneration = remuneration
        this.startDate = startDate
        this.endDate = endDate
        this.fps = fps
        if (schedule != undefined) {
            this.schedule = schedule
        }
    }
}