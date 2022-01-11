import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { OGPListService } from 'src/app/services/ogplist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OGPList } from 'src/app/models/ogp-list';
import { OgpListCommonComponent } from '../ogp-list-common/ogp-list-common.component';

@Component({
  selector: 'app-ogp-list-edit',
  templateUrl: '../ogp-list-common/ogp-list-common.component.html',
  styleUrls: ['../ogp-list-common/ogp-list-common.component.scss']
})
export class OgpListEditComponent extends OgpListCommonComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public override router: Router,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override ogpListService: OGPListService,
    public override cityService: CityService,
    public override vehicleService: VehicleService,
    public override driverService: DriverService,
    public override dialog: MatDialog) {
      super(router, formBuilder, dialogService, ogpListService, cityService, vehicleService, driverService, dialog);
      this.title = 'Edit OGP List';
    }

    override ngOnInit() {
      super.ngOnInit();

      this.route.paramMap
      .subscribe(params => {
        const id = parseInt(params.get('id') ?? '');
        this.ogpListService.getOGP(id)
        .subscribe(ogplist => {
          this.oForm.setValue({
            Id: ogplist.Id,
            OGPListDate: new Date(ogplist.OGPListDate),
            FromCity: ogplist.FromCity,
            ToCity: ogplist.ToCity,
            Vehicle: ogplist.Vehicle,
            Driver: ogplist.Driver,
            DriverPhone: ogplist.Driver.DriverPhone,
            Rent: ogplist.Rent,
            Advance: ogplist.Advance
          });
          this.selectedConsignments = ogplist.Consignments;
        }, error => this.dialogService.Error(error));
      });
    }

  saveOGPList() {
    if (this.oForm.valid) {
      if (this.selectedConsignments.length < 1) {
        this.dialogService.Alert('Add some consignments to OGP List');
        return;
      }
      const ogpList = this.oForm.value as OGPList;
      ogpList.Consignments = this.selectedConsignments;
      this.ogpListService.updateOGPList(ogpList)
      .subscribe(() => {
        this.dialogService.Alert('OGP List saved successfully')
        .then(() => this.router.navigate(['ogp-lists']));
      }, error => this.dialogService.Error(error).then(() => this.router.navigate(['ogp-lists'])));
    } else {
      this.oForm.markAsTouched;
    }
  }

}
