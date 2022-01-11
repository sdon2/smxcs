import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { CustomerAddComponent } from '../customer-add/customer-add.component';

@Component({
  selector: 'app-consignor-add',
  templateUrl: '../customer-common/customer-common.component.html',
  styleUrls: ['../customer-common/customer-common.component.scss']
})
export class ConsignorAddComponent extends CustomerAddComponent implements OnInit {

  constructor(
    public override router: Router,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override consignorService: ConsignorService,
    public override consigneeService: ConsigneeService) {
      super(router, formBuilder, dialogService, consignorService, consigneeService);
      this.title = 'Add Consignor';
      this.customerType = 'Consignor';
      this.isConsignor = true;
    }

  override ngOnInit() {
    super.ngOnInit();
  }
}
