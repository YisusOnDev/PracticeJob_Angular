import { Province } from "./province";

export class Company {
    id: number;
    email: string;
    profileImage: string;
    name: string;
    address: string;
    provinceId: number;
    province: Province;
    validatedEmail: boolean;
    stripeId: string;

    constructor(id: number, email: string, profileImage: string, name: string, address: string, provinceId: number, province: Province, validatedEmail: boolean, stripeId: string) {
        this.id = id
        this.email = email
        this.profileImage = profileImage
        this.name = name
        this.address = address
        this.provinceId = provinceId
        this.province = province
        this.validatedEmail = validatedEmail
        this.stripeId = stripeId
    }
}