import { OnInit, Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { CustomerCommonComponent } from '../customer-common/customer-common.component';

@Directive()
export abstract class CustomerEditComponent extends CustomerCommonComponent implements OnInit {

  constructor(
    public override router: Router,
    public route: ActivatedRoute,
    public override formBuilder: FormBuilder,
    public dialogService: DialogService,
    public consignorService: ConsignorService,
    public consigneeService: ConsigneeService) {
      super(router, formBuilder);
    }

  override ngOnInit() {
    super.ngOnInit();

    this.route.paramMap
    .subscribe(params => {
      // tslint:disable-next-line: radix
      const id = parseInt(params.get('id') ?? '');

      const loadFunction = this.isConsignor ? this.consignorService.getConsignor(id) : this.consigneeService.getConsignee(id);
      loadFunction
      .subscribe(data => {
        this.cForm.setValue({
          Id: data.Id,
          Name: data.Name,
          Address: data.Address,
          Address1: data.Address1,
          City: data.City,
          State: data.State,
          Pincode: data.Pincode,
          Mobile: data.Mobile,
          GSTNo: data.GSTNo,
          FreightCharge: data.FreightCharge,
          BasedOn: data.BasedOn, // Article/Weight (Per Kg)
          PaymentTerms: data.PaymentTerms,
          Remarks: data.Remarks,
        });
      }, error => this.dialogService.Error(error)
        .then(() => {
          const customerUrl = this.isConsignor ? 'consignors' : 'consignees';
          this.router.navigate([customerUrl]);
        }));
    });
  }

  saveCustomer() {
    if (this.cForm.valid) {
      const customerType = this.isConsignor ? 'Consignor' : 'Consignee';
      const saveFunction = this.isConsignor ?
        this.consignorService.updateConsignor(this.cForm.value) : this.consigneeService.updateConsignee(this.cForm.value);
      saveFunction
      .subscribe(() => {
        this.dialogService.Alert(customerType + ' saved successfully')
        .then(() => this.router.navigate([customerType.toLowerCase() + 's']));
      }, error => this.dialogService.Error(error));
    } else {
      this.cForm.markAsTouched();
    }
  }
}
