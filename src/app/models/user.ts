import { UserRole } from './enums';

export interface User {
    Id: number;
    Fullname: string;
    Username: string;
    UserPassword: string;
    CPassword?: string;
    UserRole: UserRole; // Branch = 1, Accountant = 2, Owner = 3, Admin = 4
}
