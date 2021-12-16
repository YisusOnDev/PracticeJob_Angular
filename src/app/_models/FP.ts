export class FP {
    id: number;
    name: string;
    fpGradeId: number;
    fpGrade: FPGrade;
    fpFamilyId: number;
    fpFamily: FPFamily;

    constructor(id: number, name: string, fpGradeId: number, fpGrade: FPGrade, fpFamilyId: number, fpFamily: FPFamily) {
        this.id = id
        this.name = name
        this.fpGradeId = fpGradeId
        this.fpGrade = fpGrade
        this.fpFamilyId = fpFamilyId
        this.fpFamily = fpFamily
    }
}

export class FPGrade {
    id!: number;
    name!: string;
}

export class FPFamily {
    id!: number;
    name!: string;
}