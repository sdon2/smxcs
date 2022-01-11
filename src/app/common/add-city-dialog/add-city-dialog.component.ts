import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { City } from 'src/app/models/city';
import { CityService } from 'src/app/services/city.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-add-city-dialog',
    templateUrl: './add-city-dialog.component.html',
    styleUrls: ['./add-city-dialog.component.scss']
})
export class AddCityDialogComponent {

    cityForm: FormGroup = new FormGroup({
        CityName: new FormControl(null, [Validators.required, Validators.pattern('.{3,50}')])
    });

    constructor(
        private cityService: CityService,
        private dialogService: DialogService,
        public dialogRef: MatDialogRef<AddCityDialogComponent>) { }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    _f(fieldName: string): AbstractControl {
        return this.cityForm.get(fieldName);
    }

    _fValue(fieldName: string): any {
        return this.cityForm.get(fieldName).value;
    }

    onOkClick(): void {
        if (this.cityForm.valid) {
            this.cityService.saveCity(this.cityForm.value)
                .subscribe(result => {
                    const city = { Id: result, CityName: this._fValue('CityName') } as City;
                    this.dialogRef.close(city);
                }, error => this.dialogService.Error(error));
        } else {
            this.cityForm.markAsTouched;
        }
    }

}
