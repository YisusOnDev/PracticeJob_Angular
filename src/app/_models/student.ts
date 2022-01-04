import { FP } from "./fp";
import { Province } from "./province";

export class Student {
    id: number;
    email: string;
    name: string;
    lastname: string;
    birthDate: Date;
    provinceId: number;
    province: Province;
    city: string;
    fpId: number;
    fp: FP;
    fpCalification: number;

    constructor(id: number, email: string, name: string, lastname: string, birthDate: Date, provinceId: number, province: Province, city: string, fpId: number, fp: FP, fpCalification: number) {
        this.id = id
        this.email = email
        this.name = name
        this.lastname = lastname
        this.birthDate = birthDate
        this.provinceId = provinceId
        this.province = province
        this.city = city
        this.fpId = fpId
        this.fp = fp
        this.fpCalification = fpCalification
    }
}