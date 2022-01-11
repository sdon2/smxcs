import { OnInit, Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { CustomerCommonComponent } from '../customer-common/customer-common.component';

@Directive()
export abstract class CustomerAddComponent extends CustomerCommonComponent implements OnInit {

  constructor(
    public override router: Router,
    public override formBuilder: FormBuilder,
    public dialogService: DialogService,
    public consignorService: ConsignorService,
    public consigneeService: ConsigneeService) {
      super(router, formBuilder);
    }

  override ngOnInit() {
    super.ngOnInit();
  }

  saveCustomer() {
    if (this.cForm.valid) {
      const customerType = this.isConsignor ? 'Consignor' : 'Consignee';
      const saveFunction = this.isConsignor ?
        this.consignorService.saveConsignor(this.cForm.value) : this.consigneeService.saveConsignee(this.cForm.value);
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
