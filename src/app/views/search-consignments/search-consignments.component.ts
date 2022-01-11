import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Consignment } from 'src/app/models/consignment';
import { DialogService } from 'src/app/services/dialog.service';
import { ConsignmentService } from 'src/app/services/consignment.service';
import { Helpers } from 'src/app/common/helpers';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { UserRole, ConsignmentStatus, ConsignmentPaymentModes } from 'src/app/models/enums';
import { PageEvent } from '@angular/material/paginator';
import { Consignor } from '../../models/consignor';
import { Consignee } from '../../models/consignee';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ConsignorService } from '../../services/consignor.service';
import { ConsigneeService } from '../../services/consignee.service';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'app-search-consignments',
    templateUrl: './search-consignments.component.html',
    styleUrls: ['./search-consignments.component.scss'],
})
export class SearchConsignmentsComponent implements OnInit {

    pageStats: { totalItems?: number, pageIndex?: number, pageSize?: number } | any = {};

    consignments: Consignment[] = [];
    role: UserRole;
    manualPage: string | any = null;
    isLoading = false;
    searched = false;

    consignors: Consignor[] = [];
    consignees: Consignee[] = [];

    filteredCustomers: Observable<Consignor[] | Consignee[]> | any = null;

    @ViewChild('cCustomer', { static: true }) customerAutoComplete: MatAutocomplete | any = null;
    @ViewChild('customerTrigger', { static: true }) consignorTrigger: MatAutocompleteTrigger | any = null;
    @ViewChild('htmlForm', { static: true }) htmlForm: ElementRef | null = null;

    // Advanced Search
    advancedSearchForm: any = new FormGroup({
        customerType: new FormControl('consignor', [Validators.required]),
        searchText: new FormControl(null, [Validators.required]),
        paymentMode: new FormControl(-1, [Validators.required]),
        startDate: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
    });

    constructor(
        private dialogService: DialogService,
        private consignmentService: ConsignmentService,
        private consignorService: ConsignorService,
        private consigneeService: ConsigneeService,
        private roleService: RoleService,
        private postService: PostService) {
        this.role = this.roleService.getRole();
    }

    initPageStats()
    {
        this.pageStats.pageIndex = 1;
        this.pageStats.pageSize = 25;
        this.pageStats.totalItems = 0;
    }

    ngOnInit(): void {
        this.initPageStats();

        this.consignorService.getConsignorsForConsignment()
            .subscribe(data => this.consignors = data, error => this.dialogService.Error(error));

        this.consigneeService.getConsigneesForConsignment()
            .subscribe(data => this.consignees = data, error => this.dialogService.Error(error));

        this.advancedSearchForm.valueChanges
            .subscribe(() => {
                this.initPageStats();
                this.consignments = [];
                this.searched = false;
            });

        this.filteredCustomers = this.advancedSearchForm.get('searchText').valueChanges
            .pipe(
                startWith<string | Consignor>(''),
                map((value: string|any) => typeof value === 'string' ? value : value.Name),
                map((customerName: string | any) => {
                    const customerType = this.advancedSearchForm.get('customerType').value;
                    var result;
                    if (customerName) {
                        switch (customerType) {
                            case 'consignor':
                                result = this._filterConsignors(customerName);
                                break;
                            case 'consignee':
                                result = this._filterConsignees(customerName);
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        switch (customerType) {
                            case 'consignor':
                                result = this.consignors.slice()
                                break;
                            case 'consignee':
                                result = this.consignees.slice();
                                break;
                            default:
                                break;
                        }
                    }
                    return result;
                })
            );

        this.advancedSearchForm.get('customerType').valueChanges
            .subscribe(() => {
                this.advancedSearchForm.get('searchText').patchValue('');
            });
    }

    private _filterConsignors(name: string): Consignor[] {
        const filterValue = name.toLowerCase();
        var filtered = this.consignors.filter(consignor => consignor.Name.toLowerCase().indexOf(filterValue) === 0);
        filtered.unshift({ Id: -1, Name: "Any" } as Consignor);
        return filtered;
    }

    private _filterConsignees(name: string): Consignee[] {
        const filterValue = name.toLowerCase();
        var filtered = this.consignees.filter(consignee => consignee.Name.toLowerCase().indexOf(filterValue) === 0);
        filtered.unshift({ Id: -1, Name: "Any" } as Consignee);
        return filtered;
    }

    get displayCustomerFn() {
        return (customer?: Consignor | Consignee): string | undefined => customer ? customer.Name : undefined;
    }

    validateCustomer() {
        const value = this.advancedSearchForm.controls.searchText.value;
        if (!value || this.customerAutoComplete.isOpen) { return; }
        if (!value.Name) { this.advancedSearchForm.controls.searchText.patchValue(''); }
    }

    async getNextPage(event: PageEvent) {
        this.pageStats.pageIndex = event.pageIndex + 1;
        this.searchConsignments();
    }

    async gotoPage(page: number) {
        this.pageStats.pageIndex = page;
        this.searchConsignments();
    }

    get totalPages() {
        return parseInt(Math.ceil(this.pageStats.totalItems / this.pageStats.pageSize).toString());
    }

    pagesArray(n: number): any[] {
        const pages = Array.from(Array(n).keys()).map((_, i) => i = i + 1);
        return pages;
    }

    getStatus(status: ConsignmentStatus) {
        return ConsignmentStatus[status];
    }

    paddedLRNumber(num: number) {
        if (num) {
            return Helpers.padLRNumber(num);
        }
        return '';
    }

    searchConsignments() {
        if (this.advancedSearchForm.invalid) return;
        const payload = Object.assign(this.advancedSearchForm.value, this.pageStats);
        this.isLoading = true;
        this.consignmentService.advancedSearchConsignments(payload)
            .subscribe(response => {
                if (response.pageStats) this.pageStats = response.pageStats;
                if (response.result) this.consignments = response.result;
                this.searched = true;
                this.isLoading = false;
            }, error => {
                this.consignments = [];
                this.dialogService.Error(error);
                this.searched = false;
                this.isLoading = false;
            });
    }

    exportToExcel()
    {
        if (this.searched && this.consignments.length > 0) {
            this.postService.post(this.advancedSearchForm.value, this.getActionUrl('/generate-xlsx/advanced-search-consignments'));
        }
        else {
            this.dialogService.Error('Nothing to export');
        }
    }

    getActionUrl(url: string) {
        return environment.apiUrl + url;
    }

    clearSearch() {
    }

    getChipColorForPaymentModes(pMode: ConsignmentPaymentModes) {
        let color;
        switch (pMode) {
            case ConsignmentPaymentModes.Cash:
                color = 'default';
                break;
            case ConsignmentPaymentModes.ToPay:
                color = 'accent';
                break;
            case ConsignmentPaymentModes.AccountPay:
                color = 'primary';
                break;
            default:
                color = 'default';
                break;
        }
        return color;
    }

    getPaymentMode(pMode: ConsignmentPaymentModes) {
        switch (pMode) {
            case ConsignmentPaymentModes.Cash:
                return 'Paid';
            case ConsignmentPaymentModes.ToPay:
                return 'To Pay';
            case ConsignmentPaymentModes.AccountPay:
                return 'A/C Pay';
            default:
                return null;
        }
    }

    getChipColor(status: ConsignmentStatus) {
        let color;
        switch (status) {
            case ConsignmentStatus.New:
                color = 'primary';
                break;
            case ConsignmentStatus.OnTransit:
                color = 'accent';
                break;
            case ConsignmentStatus.Received:
                color = 'primary';
                break;
            default:
                color = 'default';
                break;
        }
        return color;
    }

    getFormValidationErrors() {
        Object.keys(this.advancedSearchForm.controls).forEach(key => {
            const controlErrors = this.advancedSearchForm.get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
            }
        });
    }
}
