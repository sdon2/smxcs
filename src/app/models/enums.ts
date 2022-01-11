export enum ConsignmentStatus {
    New = 1,
    OnTransit,
    Received,
    Delivered
}

export enum ConsignmentPaymentModes {
    Cash = 1,
    ToPay,
    AccountPay
}

export enum UserRole {
    Branch = 1,
    Accountant,
    Owner,
    Admin
}
