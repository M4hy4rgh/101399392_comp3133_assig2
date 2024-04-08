import { get } from 'http';
export interface Employee_model {
    _id: string;
    first_name: string;
    last_name: string;
    email: string
    gender: string;
    salary: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Employee_Imput {
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    salary: number;
}
