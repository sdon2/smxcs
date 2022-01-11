import { OnInit, Component } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { CustomersComponent } from 'src/app/views/customers/customers.component';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-consignees',
  templateUrl: '../customers/customers.component.html',
  styleUrls: ['../customers/customers.component.scss']
})
export class ConsigneesComponent extends CustomersComponent implements OnInit {

  constructor(
    public override dialogService: DialogService,
    public override consignorService: ConsignorService,
    public override consigneeService: ConsigneeService,
    public override roleService: RoleService,
    public override router: Router) {
      super(dialogService, consignorService, consigneeService, roleService, router);
      this.isConsignor = false;
      this.customerType = 'Consignee';
    }

  override async ngOnInit() {
    super.ngOnInit();
  }

}
