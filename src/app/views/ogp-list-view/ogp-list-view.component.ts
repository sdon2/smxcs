import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { OGPListService } from 'src/app/services/ogplist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OgpListCommonComponent } from '../ogp-list-common/ogp-list-common.component';
import { OGPList } from 'src/app/models/ogp-list';

@Component({
  selector: 'app-ogp-list-view',
  templateUrl: '../ogp-list-common/ogp-list-common.component.html',
  styleUrls: ['../ogp-list-common/ogp-list-common.component.scss']
})
export class OgpListViewComponent extends OgpListCommonComponent implements OnInit {

  private ogpList: OGPList | undefined;

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
    this.title = 'View OGP List';
    this.isReadOnly = true;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.route.paramMap
      .subscribe(params => {
        const id = parseInt(params.get('id') ?? '');
        this.ogpListService.getOGP(id)
          .subscribe(ogplist => {
            this.ogpList = ogplist;
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
          });
      }, error => this.dialogService.Error(error).then(() => this.router.navigate(['ogp-lists'])));
  }

  _pf(text: string) {
    return parseFloat(text);
  }

  override get Balance() {
    const ogpList = this.ogpList as any;
    if (ogpList) {
      const rent = this._pf(ogpList.Rent);
      const advance = this._pf(ogpList.Advance);
      return (rent - advance).toFixed(2);
    }
    return '0.00';
  }

  saveOGPList() {

  }
}
