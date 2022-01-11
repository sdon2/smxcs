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
import { Consignment } from 'src/app/models/consignment';

@Component({
  selector: 'app-consignment-view',
  templateUrl: '../consignment-common/consignment-common.component.html',
  styleUrls: ['../consignment-common/consignment-common.component.scss']
})
export class ConsignmentViewComponent extends ConsignmentCommonComponent implements OnInit {

  private consignment: Consignment | any;

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
    this.title = 'View Consignment';
  }

  override ngOnInit() {
    this.isReadOnly = true;
    super.ngOnInit();

    this.route.paramMap
      .subscribe(params => {
        const id = parseInt(params.get('id') ?? '');
        this.consignmentService.getConsignment(id)
          .subscribe(consignment => {
            this.consignment = consignment;
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
          }, error => this.dialogService.Error(error).then(() => this.router.navigate(['consignments']))
          );
      });
  }

  _pf(text: string) {
    return parseFloat(text);
  }

  override get Total() {
    const consignment = this.consignment as any;
    if (consignment) {
      const fc = this._pf(consignment.FreightCharge);
      const dc = this._pf(consignment.DeliveryCharges);
      const lc = this._pf(consignment.LoadingCharges);
      const uc = this._pf(consignment.UnloadingCharges);
      const gst = this._pf(consignment.GSTAmount);
      return (fc + dc + lc + uc + gst).toFixed(2);
    }
    return '0.00';
  }

  saveConsignment() {

  }
}
