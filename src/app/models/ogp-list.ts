import { Consignment } from './consignment';
import { Vehicle } from './vehicle';
import { Driver } from './driver';

export interface OGPList {
    Id: number;
    OGPListDate: Date;
    Vehicle: Vehicle;
    Driver: Driver;
    DriverPhone: string;
    FromCity: number;
    ToCity: number;
    Rent: number;
    Advance: number;
    Consignments: Array<Consignment>;
}
