import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { Consignee } from 'src/app/models/consignee';
import { Consignor } from 'src/app/models/consignor';

@Component({
    selector: 'app-add-customer-dialog',
    templateUrl: './add-customer-dialog.component.html',
    styleUrls: ['./add-customer-dialog.component.scss']
})
export class AddCustomerDialogComponent implements OnInit {

    public customerType: 'consignor' | 'consignee' = 'consignor';

    customerForm: FormGroup;

    constructor(
        private consignorService: ConsignorService,
        private consigneeService: ConsigneeService,
        private dialogService: DialogService,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddCustomerDialogComponent>) { }

    ngOnInit() {
        this.customerType = this.data.customerType;
        this.customerForm = this.formBuilder.group({
            Id: [null],
            Name: [null, [Validators.required]],
            Address: [null, [Validators.required]],
            Address1: [null],
            City: [null, [Validators.required]],
            State: [null, [Validators.required]],
            Pincode: [null, [Validators.required]],
            Mobile: [null, [Validators.required, Validators.pattern('[0-9]{10}')]],
            GSTNo: [null, [Validators.required]],
            FreightCharge: [0, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            BasedOn: ['article', [Validators.required]], // Article/Weight (Per Kg)
            PaymentTerms: [2, [Validators.required]],
            Remarks: [null]
        });
    }

    get isConsignor() {
        return this.customerType === 'consignor';
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    _f(fieldName: string): AbstractControl {
        return this.customerForm.get(fieldName);
    }

    _fValue(fieldName: string): any {
        return this.customerForm.get(fieldName).value;
    }

    onOkClick(): void {
        if (this.customerForm.valid) {
            const saveFunction = this.isConsignor ?
                this.consignorService.saveConsignor(this.customerForm.value) :
                this.consigneeService.saveConsignee(this.customerForm.value);
            saveFunction
                .subscribe(result => {
                    this.customerForm.patchValue({ Id: result });
                    const customer = this.isConsignor ? this.customerForm.value as Consignor : this.customerForm.value as Consignee;
                    this.dialogRef.close(customer);
                }, error => this.dialogService.Error(error));
        } else {
            this.customerForm.markAsTouched();
        }
    }
}
