import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { OGPListService } from 'src/app/services/ogplist.service';
import { Router } from '@angular/router';
import { OGPList } from 'src/app/models/ogp-list';
import { OgpListCommonComponent } from '../ogp-list-common/ogp-list-common.component';

@Component({
  selector: 'app-ogp-list-add',
  templateUrl: '../ogp-list-common/ogp-list-common.component.html',
  styleUrls: ['../ogp-list-common/ogp-list-common.component.scss']
})
export class OgpListAddComponent extends OgpListCommonComponent implements OnInit {

  constructor(
    public override router: Router,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override ogpListService: OGPListService,
    public override cityService: CityService,
    public override vehicleService: VehicleService,
    public override driverService: DriverService,
    public override dialog: MatDialog) {
      super(router, formBuilder, dialogService, ogpListService, cityService, vehicleService, driverService, dialog);
      this.title = 'Add OGP List';
    }

  saveOGPList() {
    if (this.oForm.valid) {
      if (this.selectedConsignments.length < 1) {
        this.dialogService.Alert('Add some consignments to OGP List');
        return;
      }
      const ogpList = this.oForm.value as OGPList;
      ogpList.Consignments = this.selectedConsignments;
      this.ogpListService.saveOGPList(ogpList)
      .subscribe(() => {
        this.dialogService.Alert('OGP List saved successfully')
        .then(() => this.router.navigate(['ogp-lists']));
      }, error => this.dialogService.Error(error));
    } else {
      this.oForm.markAsTouched;
    }
  }

}
