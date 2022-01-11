import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';

@Component({
  selector: 'app-consignor-edit',
  templateUrl: '../customer-common/customer-common.component.html',
  styleUrls: ['../customer-common/customer-common.component.scss']
})
export class ConsignorEditComponent extends CustomerEditComponent implements OnInit {

  constructor(
    public override router: Router,
    public override route: ActivatedRoute,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override consignorService: ConsignorService,
    public override consigneeService: ConsigneeService) {
      super(router, route, formBuilder, dialogService, consignorService, consigneeService);
      this.title = 'Edit Consignor';
      this.customerType = 'Consignor';
      this.isConsignor = true;
    }

  override ngOnInit() {
    super.ngOnInit();
  }
}
