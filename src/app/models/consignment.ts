import { ConsignmentPaymentModes, ConsignmentStatus } from './enums';
import { City } from './city';
import { Consignor } from './consignor';
import { Consignee } from './consignee';

export interface Consignment {
    Id: number;
    ConsignmentDate?: Date;
    LRNumber: number;
    Consignor: Consignor;
    Consignee: Consignee;
    FromCity: City;
    ToCity: City;
    NoOfItems: number;
    Description: string;
    ChargedWeightKgs: number;
    FreightCharge: number;
    DeliveryCharges: number;
    LoadingCharges: number;
    UnloadingCharges: number;
    Demurrage: number;
    GSTPercent: number;
    GSTAmount: number;
    InvoiceNumber: string;
    InvoiceValue: string;
    PaymentMode: ConsignmentPaymentModes;
    OGP_Id: number;
    Bill_Id: number;
    Status: ConsignmentStatus;
}
