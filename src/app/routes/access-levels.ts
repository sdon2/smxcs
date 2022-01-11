import { UserRole } from 'src/app/models/enums';

export const AccessLevels = {
    Branch: [
        UserRole.Branch,
        UserRole.Accountant,
        UserRole.Owner,
        UserRole.Admin
    ],
    Accountant: [
        UserRole.Accountant,
        UserRole.Owner,
        UserRole.Admin
    ],
    Owner: [
        UserRole.Owner,
        UserRole.Admin
    ]
};
