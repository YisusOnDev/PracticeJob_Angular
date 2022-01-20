import { Province } from "./province";

export class Company {
    id: number;
    email: string;
    name: string;
    address: string;
    provinceId: number;
    province: Province;
    validatedEmail: boolean;

    constructor(id: number, email: string, name: string, address: string, provinceId: number, province: Province, validatedEmail: boolean) {
        this.id = id
        this.email = email
        this.name = name
        this.address = address
        this.provinceId = provinceId
        this.province = province
        this.validatedEmail = validatedEmail
    }
}