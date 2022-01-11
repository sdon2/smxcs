import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { ConsignmentService } from 'src/app/services/consignment.service';
import { Router } from '@angular/router';
import { ConsignmentCommonComponent } from '../consignment-common/consignment-common.component';
import { Config } from 'src/app/app.config';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';

@Component({
  selector: 'app-consignment-add',
  templateUrl: '../consignment-common/consignment-common.component.html',
  styleUrls: ['../consignment-common/consignment-common.component.scss']
})
export class ConsignmentAddComponent extends ConsignmentCommonComponent implements OnInit {

  constructor(
    public override router: Router,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override cityService: CityService,
    public override consignmentService: ConsignmentService,
    public override consignorService: ConsignorService,
    public override consigneeService: ConsigneeService,
    public override dialog: MatDialog) {
    super(router, formBuilder, dialogService, cityService, consignmentService, consignorService, consigneeService, dialog);
    this.title = 'Add Consignment';
  }

  override ngOnInit() {
    super.ngOnInit();

    this.consignmentService.getNewLRNumber()
      .subscribe(data => this._f('LRNumber').patchValue(data), error => this.dialogService.Error(error));

    this.initPricingHelpers();
  }

  saveConsignment() {
    if (this.cForm.valid) {
      this.consignmentService.saveConsignment(this.cForm.value)
        .subscribe(data => {
          this.dialogService.Confirm('Consignment saved successfully. Do you want to print this consignment?')
            .then(result => {
              if (result.value) {
                window.open(`${Config.ApiRoot}/pdf/consignment/${data}`, '_blank');
              }
              this.router.navigate(['consignments']);
            });
        }, error => this.dialogService.Error(error));
    } else {
      this.cForm.markAsTouched();
    }
  }
}
