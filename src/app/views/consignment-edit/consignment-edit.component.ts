import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { ConsignmentService } from 'src/app/services/consignment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsignmentCommonComponent } from '../consignment-common/consignment-common.component';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';

@Component({
  selector: 'app-consignment-edit',
  templateUrl: '../consignment-common/consignment-common.component.html',
  styleUrls: ['../consignment-common/consignment-common.component.scss']
})
export class ConsignmentEditComponent extends ConsignmentCommonComponent implements OnInit {

  constructor(
    public override router: Router,
    public route: ActivatedRoute,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override cityService: CityService,
    public override consignmentService: ConsignmentService,
    public override consignorService: ConsignorService,
    public override consigneeService: ConsigneeService,
    public override dialog: MatDialog) {
      super(router, formBuilder, dialogService, cityService, consignmentService, consignorService, consigneeService, dialog);
      this.title = 'Edit Consignment';
    }

  override ngOnInit() {
    super.ngOnInit();

    this.route.paramMap
    .subscribe(params => {
      // tslint:disable-next-line: radix
      const id = parseInt(params.get('id') ?? '');
      this.consignmentService.getConsignment(id)
      .subscribe(consignment => {
        this.cForm.setValue({
          LRNumber: consignment.LRNumber,
          Id: consignment.Id,
          ConsignmentDate: new Date(consignment.ConsignmentDate ?? Date.now()),
          FromCity: consignment.FromCity,
          ToCity: consignment.ToCity,
          Consignor: consignment.Consignor,
          Consignee: consignment.Consignee,
          NoOfItems: consignment.NoOfItems,
          Description: consignment.Description,
          ChargedWeightKgs: consignment.ChargedWeightKgs,
          FreightCharge: consignment.FreightCharge,
          DeliveryCharges: consignment.DeliveryCharges,
          LoadingCharges: consignment.LoadingCharges,
          UnloadingCharges: consignment.UnloadingCharges,
          GSTPercent: consignment.GSTPercent,
          GSTAmount: consignment.GSTAmount,
          Demurrage: consignment.Demurrage,
          InvoiceNumber: consignment.InvoiceNumber,
          PaymentMode: consignment.PaymentMode,
        });
        this.setPricingHelpers(consignment.Consignor);
        this.setPricingHelpers(consignment.Consignee);
      }, error => this.dialogService.Error(error).then(() => this.router.navigate(['consignments'])));
    });
  }

  saveConsignment() {
    if (this.cForm.valid) {
      this.consignmentService.updateConsignment(this.cForm.value)
      .subscribe(() => {
        this.dialogService.Alert('Consignment saved successfully')
        .then(() => this.router.navigate(['consignments']));
      }, error => this.dialogService.Error(error));
    } else {
      this.cForm.markAsTouched();
    }
  }
}
