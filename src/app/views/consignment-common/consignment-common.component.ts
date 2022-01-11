import { OnInit, ViewChild, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { City } from 'src/app/models/city';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AddCityDialogComponent } from 'src/app/common/add-city-dialog/add-city-dialog.component';
import { AddCustomerDialogComponent } from 'src/app/common/add-customer-dialog/add-customer-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';
import { CityService } from 'src/app/services/city.service';
import { ConsignmentService } from 'src/app/services/consignment.service';
import { MinimumAmountValidator } from 'src/app/common/minimum-amount.validator';
import { Router } from '@angular/router';
import { Helpers } from 'src/app/common/helpers';
import { Consignor } from 'src/app/models/consignor';
import { Consignee } from 'src/app/models/consignee';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';

@Directive()
export abstract class ConsignmentCommonComponent implements OnInit {

    public title: string | any = null;
    cForm: FormGroup | any;
    isReadOnly = false;

    cities: City[] = [];
    consignors: Consignor[] = [];
    consignees: Consignee[] = [];
    LRNumber = '';

    pricingHelpers!: {
        BasedOn: 'article' | 'weight';
        FreightCharge: number;
        PaymentMode: number;
        Formula?: () => void;
    };

    filteredFromCities!: Observable<City[]>;
    filteredToCities!: Observable<City[]>;
    filteredConsignors!: Observable<Consignor[]>;
    filteredConsignees!: Observable<Consignee[]>;

    @ViewChild('cConsignor', { static: true })
    consignorAutoComplete!: MatAutocomplete;
    @ViewChild('cConsignee', { static: true })
    consigneeAutoComplete!: MatAutocomplete;
    @ViewChild('fromCity', { static: true })
    fromCityAutoComplete!: MatAutocomplete;
    @ViewChild('toCity', { static: true })
    toCityAutoComplete!: MatAutocomplete;

    @ViewChild('fromCityTrigger', { static: true })
    fromCityTrigger!: MatAutocompleteTrigger;
    @ViewChild('toCityTrigger', { static: true })
    toCityTrigger!: MatAutocompleteTrigger;
    @ViewChild('consignorTrigger', { static: true })
    consignorTrigger!: MatAutocompleteTrigger;
    @ViewChild('consigneeTrigger', { static: true })
    consigneeTrigger!: MatAutocompleteTrigger;

    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public dialogService: DialogService,
        public cityService: CityService,
        public consignmentService: ConsignmentService,
        public consignorService: ConsignorService,
        public consigneeService: ConsigneeService,
        public dialog: MatDialog) {

        this.cForm = this.formBuilder.group({
            LRNumber: [0],
            Id: [null],
            ConsignmentDate: [new Date(), [Validators.required]],
            FromCity: [null, [Validators.required]],
            ToCity: [null, [Validators.required]],
            Consignor: [null, [Validators.required]],
            Consignee: [null, [Validators.required]],
            NoOfItems: [1, [Validators.required, Validators.pattern('[0-9]+')]],
            Description: [null, [Validators.required, Validators.pattern('.{3,100}')]],
            ChargedWeightKgs: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            FreightCharge: [0.00, [Validators.required, MinimumAmountValidator, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            DeliveryCharges: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            LoadingCharges: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            UnloadingCharges: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            GSTPercent: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            GSTAmount: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            Demurrage: [0.00, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
            InvoiceNumber: [null],
            PaymentMode: [2]
        });
    }

    initPricingHelpers() {
        this.pricingHelpers = {
            BasedOn: 'article',
            FreightCharge: 0.00,
            PaymentMode: 2,
            Formula: () => {}
        };
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

        this.consignorService.getConsignorsForConsignment()
            .subscribe(data => this.consignors = data, error => this.dialogService.Error(error));

        this.consigneeService.getConsigneesForConsignment()
            .subscribe(data => this.consignees = data, error => this.dialogService.Error(error));

        this.filteredFromCities = this.cForm.get('FromCity').valueChanges
            .pipe(
                startWith<string | City>(''),
                map((value: string | any) => typeof value === 'string' ? value : value.CityName),
                map((cityName: string | any) => cityName ? this._filterCities(cityName) : this.cities.slice())
            );

        this.filteredToCities = this.cForm.get('ToCity').valueChanges
            .pipe(
                startWith<string | City>(''),
                map((value: string | any) => typeof value === 'string' ? value : value.CityName),
                map((cityName: string | any) => cityName ? this._filterCities(cityName) : this.cities.slice())
            );

        this.filteredConsignors = this.cForm.get('Consignor').valueChanges
            .pipe(
                startWith<string | Consignor>(''),
                map((value: string | any) => typeof value === 'string' ? value : value.Name),
                map((consignorName: string | any) => consignorName ? this._filterConsignors(consignorName) : this.consignors.slice())
            );

        this.filteredConsignees = this.cForm.get('Consignee').valueChanges
            .pipe(
                startWith<string | Consignee>(''),
                map((value: string | any) => typeof value === 'string' ? value : value.Name),
                map((consigneeName: string | any) => consigneeName ? this._filterConsignees(consigneeName) : this.consignees.slice())
            );

        this._f('LRNumber').valueChanges
            .subscribe((value: string | any) => this.LRNumber = Helpers.padLRNumber(value), (error: string | any) => this.dialogService.Error(error));

        if (this.isReadOnly) {
            Object.keys(this.cForm.controls).forEach(field => {
                this.cForm.get(field).disable({ onlySelf: true });
            });
        }

        this._f('ChargedWeightKgs').valueChanges
            .subscribe((value: string | any) => {
                if (value && this.pricingHelpers && this.pricingHelpers.BasedOn === 'weight') {
                    const fc = this.pricingHelpers.FreightCharge;
                    this._f('FreightCharge').patchValue(value * fc);
                }
            });

        this._f('NoOfItems').valueChanges
            .subscribe((value: string | any) => {
                if (value && this.pricingHelpers && this.pricingHelpers.BasedOn === 'article') {
                    const fc = this.pricingHelpers.FreightCharge;
                    this._f('FreightCharge').patchValue(value * fc);
                }
            });
    }

    get displayCityFn() {
        return (city?: City): string | undefined => city ? city.CityName : undefined;
    }

    get displayCustomerFn() {
        return (customer?: Consignor | Consignee): string | undefined => customer ? customer.Name : undefined;
    }

    private _filterCities(cityName: string): City[] {
        const filterValue = cityName.toLowerCase();
        return this.cities.filter(city => city.CityName.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filterConsignors(name: string): Consignor[] {
        const filterValue = name.toLowerCase();
        return this.consignors.filter(consignor => consignor.Name.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filterConsignees(name: string): Consignee[] {
        const filterValue = name.toLowerCase();
        return this.consignees.filter(consignee => consignee.Name.toLowerCase().indexOf(filterValue) === 0);
    }

    validateCity(cityElement: string) {
        const value = this._f(cityElement).value;
        if (!value || this.fromCityAutoComplete.isOpen || this.toCityAutoComplete.isOpen) { return; }
        if (!value.CityName) { this._f(cityElement).patchValue(''); }
    }

    validateCustomer(consignorElement: string) {
        const value = this._f(consignorElement).value;
        if (!value || this.consignorAutoComplete.isOpen || this.consigneeAutoComplete.isOpen) { return; }
        if (!value.Name) { this._f(consignorElement).patchValue(''); }
    }

    setPricingHelpers(customer: Consignor | Consignee) {
        if (customer.FreightCharge > 0) {
            this._f('PaymentMode').patchValue(customer.PaymentTerms);
            this.pricingHelpers = {
                BasedOn: customer.BasedOn,
                FreightCharge: customer.FreightCharge,
                PaymentMode: customer.PaymentTerms,
                Formula: () => {
                    const fc = customer.FreightCharge;
                    const bo = customer.BasedOn === 'article' ?
                        this._f('NoOfItems') : this._f('ChargedWeightKgs');
                    const fcc = parseFloat(fc.toFixed(2));
                    const boc = bo.valid ? parseFloat(bo.value) : 0.00;
                    this._f('FreightCharge').patchValue(fcc * boc);
                }
            };
        }
    }

    _f(fieldName: string): any {
        return this.cForm.get(fieldName);
    }

    get Total() {
        const dCharge = this._f('DeliveryCharges');
        const fCharge = this._f('FreightCharge');
        const loadingCharges = this._f('LoadingCharges');
        const unloadingCharges = this._f('UnloadingCharges');
        const gstPercent = this._f('GSTPercent');
        const gstAmount = this._f('GSTAmount');

        const dc = dCharge.valid ? parseFloat(dCharge.value) : 0;
        const fc = fCharge.valid ? parseFloat(fCharge.value) : 0;
        const lc = loadingCharges.valid ? parseFloat(loadingCharges.value) : 0;
        const ulc = unloadingCharges.valid ? parseFloat(unloadingCharges.value) : 0;
        const gstp = gstPercent.valid ? parseFloat(gstPercent.value) : 0;

        const gsta = (fc > 0) ? (fc * gstp * 0.01) : 0;
        gstAmount.patchValue(gsta.toFixed(2));

        return (dc + fc + lc + ulc + gsta).toFixed(2);
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

    openNewConsignorDialog() {
        this.openNewCustomerDialog('consignor');
    }

    openNewConsigneeDialog() {
        this.openNewCustomerDialog('consignee');
    }

    openNewCustomerDialog(customerType: 'consignor' | 'consignee'): void {
        const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
            width: '650px',
            disableClose: true,
            data: {
                customerType: customerType
            }
        });

        dialogRef.afterOpened().subscribe(() => {
            if (this.consignorAutoComplete.isOpen) { this.consignorTrigger.closePanel(); }
            if (this.consigneeAutoComplete.isOpen) { this.consigneeTrigger.closePanel(); }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (customerType === 'consignor') {
                    this.consignors.push(result);
                    this._f('Consignor').patchValue(result as Consignor);
                } else {
                    this.consignees.push(result);
                    this._f('Consignee').patchValue(result as Consignee);
                }
            }
        });
    }
}
