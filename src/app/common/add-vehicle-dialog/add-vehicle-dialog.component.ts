import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from 'src/app/models/vehicle';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
    selector: 'app-add-vehicle-dialog',
    templateUrl: './add-vehicle-dialog.component.html',
    styleUrls: ['./add-vehicle-dialog.component.scss']
})
export class AddVehicleDialogComponent {

    vehicleForm: FormGroup = new FormGroup({
        RegNumber: new FormControl(null, [Validators.required, Validators.pattern('.{4,20}')])
    });

    constructor(
        private vehicleService: VehicleService,
        private dialogService: DialogService,
        public dialogRef: MatDialogRef<AddVehicleDialogComponent>) { }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    _f(fieldName: string): AbstractControl {
        return this.vehicleForm.get(fieldName);
    }

    _fValue(fieldName: string): any {
        return this.vehicleForm.get(fieldName).value;
    }

    onOkClick(): void {
        if (this.vehicleForm.valid) {
            this.vehicleService.saveVehicle(this.vehicleForm.value)
                .subscribe(result => {
                    const city = { Id: result, RegNumber: this._fValue('RegNumber') } as Vehicle;
                    this.dialogRef.close(city);
                }, error => this.dialogService.Error(error));
        } else {
            this.vehicleForm.markAsTouched;
        }
    }
}
