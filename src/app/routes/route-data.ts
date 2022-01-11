import { UserRole } from 'src/app/models/enums';

export interface RouteData {
    title?: string;
    accessLevel?: UserRole[];
}
