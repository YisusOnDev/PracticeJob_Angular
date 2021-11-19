import { Province } from "./province";

export class Company {
    id?: number;
    email?: string;
    name?: string;
    address?: string;
    provinceId?: number;
    province?: Province;
    token?: string;
}