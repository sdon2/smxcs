export interface Consignor {
    Id: number;
    Name: string;
    Address: string;
    Address1: string;
    City: string;
    State: string;
    Pincode: string;
    Mobile: string;
    GSTNo: string;
    FreightCharge: number;
    BasedOn: 'article' | 'weight'; // Article/Weight (Per Kg)
    PaymentTerms: number;
    Remarks: string;
}
