import { OnInit, ViewChild, Directive } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { City } from 'src/app/models/city';
import { Vehicle } from 'src/app/models/vehicle';
import { Driver } from 'src/app/models/driver';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DriverService } from 'src/app/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { AddCityDialogComponent } from 'src/app/common/add-city-dialog/add-city-dialog.component';
import { AddVehicleDialogComponent } from 'src/app/common/add-vehicle-dialog/add-vehicle-dialog.component';
import { Consignment } from 'src/app/models/consignment';
import { SelectConsignmentsDialogComponent } from 'src/app/common/select-consignments-dialog/select-consignments-dialog.component';
import { OGPListService } from 'src/app/services/ogplist.service';
import { Router } from '@angular/router';
import { Helpers } from 'src/app/common/helpers';

@Directive()
export class OgpListCommonComponent implements OnInit {

  isReadOnly = false;

  title: string = null;
  oForm: FormGroup;

  cities: City[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  filteredFromCities: Observable<City[]>;
  filteredToCities: Observable<City[]>;
  filteredVehicles: Observable<Vehicle[]>;
  filteredDrivers: Observable<Driver[]>;

  selectedConsignments: Consignment[] = [];

  @ViewChild('fromCity', { static: true }) fromCityAutoComplete: MatAutocomplete;
  @ViewChild('toCity', { static: true }) toCityAutoComplete: MatAutocomplete;
  @ViewChild('aVehicle', { static: true }) vehicleAutoComplete: MatAutocomplete;

  @ViewChild('fromCityTrigger', { static: true }) fromCityTrigger: MatAutocompleteTrigger;
  @ViewChild('toCityTrigger', { static: true }) toCityTrigger: MatAutocompleteTrigger;
  @ViewChild('vehicleTrigger', { static: true }) vehicleTrigger: MatAutocompleteTrigger;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public dialogService: DialogService,
    public ogpListService: OGPListService,
    public cityService: CityService,
    public vehicleService: VehicleService,
    public driverService: DriverService,
    public dialog: MatDialog) {

      this.oForm = this.formBuilder.group({
        Id: [null],
        OGPListDate: [new Date(), [Validators.required]],
        FromCity: [null, [Validators.required]],
        ToCity: [null, [Validators.required]],
        Vehicle: [null, [Validators.required]],
        Driver: [null, [Validators.required]],
        DriverPhone: [null, [Validators.required]],
        Rent: [0, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
        Advance: [0, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]]
      });
  }

  ngOnInit() {
    this.cityService.getCities()
      .subscribe(data => {
        this.cities = data;
        const fCity = this.cities.find(i => i.CityName.toLowerCase() == 'tirupur');
        const tCity = this.cities.find(i => i.CityName.toLowerCase() == 'bangalore');
        if (fCity && tCity) {
          this._f('FromCity').patchValue(fCity);
          this._f('ToCity').patchValue(tCity);
        }
      }, error => this.dialogService.Error(error));

    this.vehicleService.getVehicles()
      .subscribe(data => this.vehicles = data, error => this.dialogService.Error(error));

    this.driverService.getDrivers()
      .subscribe(data => this.drivers = data, error => this.dialogService.Error(error));

    this.filteredFromCities = this.oForm.get('FromCity').valueChanges
    .pipe(
      startWith<string | City>(''),
      map(value => typeof value === 'string' ? value : value.CityName),
      map(cityName => cityName ? this._filterCities(cityName) : this.cities.slice())
    );

    this.filteredToCities = this.oForm.get('ToCity').valueChanges
    .pipe(
      startWith<string | City>(''),
      map(value => typeof value === 'string' ? value : value.CityName),
      map(cityName => cityName ? this._filterCities(cityName) : this.cities.slice())
    );

    this.filteredVehicles = this.oForm.get('Vehicle').valueChanges
    .pipe(
      startWith<string | Vehicle>(''),
      map(value => typeof value === 'string' ? value : value.RegNumber),
      map(regNumber => regNumber ? this._filterVehicles(regNumber) : this.vehicles.slice())
    );

    this.filteredDrivers = this.oForm.get('Driver').valueChanges
    .pipe(
      startWith<string | Driver>(''),
      map(value => typeof value === 'string' ? value : value.DriverName),
      map(driverName => driverName ? this._filterDrivers(driverName) : this.drivers.slice())
    );

    if (this.isReadOnly) {
      Object.keys(this.oForm.controls).forEach(field => {
        this.oForm.get(field).disable({ onlySelf: true});
      });
    }
  }

  get displayCityFn() {
    return (city?: City): string | undefined => city ? city.CityName : undefined;
  }

  get displayVehicleFn() {
    return (vehicle?: Vehicle): string | undefined => vehicle ? vehicle.RegNumber : undefined;
  }

  get displayDriverFn() {
    return (driver?: Driver): string | undefined => {
      if (driver) { (this._f('DriverPhone') as AbstractControl).patchValue(driver.DriverPhone); }
      return driver ? driver.DriverName : undefined;
    };
  }

  private _filterCities(cityName: string): City[] {
    const filterValue = cityName.toLowerCase();
    return this.cities.filter(city => city.CityName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterVehicles(regNumber: string): Vehicle[] {
    const filterValue = regNumber.toLowerCase();
    return this.vehicles.filter(vehicle => vehicle.RegNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterDrivers(driverName: string): Driver[] {
    const filterValue = driverName.toLowerCase();
    return this.drivers.filter(driver => driver.DriverName.toLowerCase().indexOf(filterValue) === 0);
  }

  validateCity(cityElement: string) {
    const value = this._f(cityElement).value;
    if (!value || this.fromCityAutoComplete.isOpen || this.toCityAutoComplete.isOpen) { return; }
    if (!value.CityName) { this._f(cityElement).patchValue(''); }
  }

  validateVehicle(vehicleElement: string) {
    const value = this._f(vehicleElement).value;
    if (!value || this.vehicleAutoComplete.isOpen) { return; }
    if (!value.RegNumber) { this._f(vehicleElement).patchValue(''); }
  }

  _f(fieldName: string): any {
    return this.oForm.get(fieldName);
  }

  padLRNumber(number: any) {
    return Helpers.padLRNumber(number);
  }

  openNewCityDialog(cityType: 'from' | 'to'): void {
    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterOpened().subscribe(() => {
      if (this.fromCityAutoComplete.isOpen) { this.fromCityTrigger.closePanel(); }
      if (this.toCityAutoComplete.isOpen) { this.toCityTrigger.closePanel(); }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cities.push(result);
        if (cityType === 'from') { this._f('FromCity').patchValue(result as City); } else { this._f('ToCity').patchValue(result as City); }
      }
    });
  }

  openNewVehicleDialog(): void {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterOpened().subscribe(() => {
      if (this.vehicleAutoComplete.isOpen) { this.vehicleTrigger.closePanel(); }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicles.push(result);
        this._f('Vehicle').patchValue(result as Vehicle);
      }
    });
  }

  openSelectConsignmentsDialog(): void {
    const data: Consignment[] = [];
    this.selectedConsignments.forEach(item => data.push(item));
    const dialogRef = this.dialog.open(SelectConsignmentsDialogComponent, {
      width: '600px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const returnedConsignments = result as Consignment[];
        this.selectedConsignments.splice(0, this.selectedConsignments.length);
        returnedConsignments.forEach(consignment => this.selectedConsignments.push(consignment));
      }
    });
  }

  get Balance() {
    const r = this._f('Rent');
    const a = this._f('Advance');

    const rent = r.valid ? parseFloat(r.value) : 0;
    const advance = a.valid ? parseFloat(a.value) : 0;

    return (rent - advance).toFixed(2);
  }

}
