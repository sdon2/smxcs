import { Component, OnInit, OnDestroy } from '@angular/core';
import { Consignment } from 'src/app/models/consignment';
import { DialogService } from 'src/app/services/dialog.service';
import { ConsignmentService } from 'src/app/services/consignment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Config } from 'src/app/app.config';
import { PageEvent } from '@angular/material/paginator';
import { Helpers } from 'src/app/common/helpers';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { UserRole, ConsignmentStatus, ConsignmentPaymentModes } from 'src/app/models/enums';

@Component({
    selector: 'app-consignments',
    templateUrl: './consignments.component.html',
    styleUrls: ['./consignments.component.scss']
})
export class ConsignmentsComponent implements OnInit {

    consignments: Consignment[] | any = [];
    isLoading = true;
    pageStats: { totalItems?: number, pageIndex?: number, pageSize?: number } | any = {};

    searched = false;
    searchText: FormControl = new FormControl(null);

    role: UserRole;

    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canPrint: boolean;
    canDelete: boolean;
    branchAndOwner: boolean;

    manualPage: number | any;

    filteredStatuses: any = {};

    constructor(
        private dialogService: DialogService,
        private consignmentService: ConsignmentService,
        private roleService: RoleService,
        private router: Router,
        private route: ActivatedRoute) {
        this.role = this.roleService.getRole();
        this.canEdit = this.role == UserRole.Owner || this.role == UserRole.Admin || this.role == UserRole.Accountant;
        this.canPrint = this.canEdit;
        this.canAdd = this.canEdit;
        this.canDelete = this.role == UserRole.Owner || this.role == UserRole.Admin;
        this.canView = this.canAdd || this.role == UserRole.Branch;
        this.branchAndOwner = this.canDelete || this.role == UserRole.Branch;
    }

    initPageStats() {
        this.pageStats.pageIndex = 0;
        this.pageStats.pageSize = 25;
        this.pageStats.totalItems = 100;
    }

    async ngOnInit() {
        this.isLoading = true;
        this.initPageStats();
        this.route.params.subscribe(async params => {
            const page = parseInt(params['page']);
            if (!isNaN(page)) {
                this.manualPage = page;
                this.pageStats.pageIndex = (page - 1);
            }
            this.consignments = await this.getConsignments(this.pageStats.pageIndex, this.pageStats.pageSize);
        });
        this.isLoading = false;
    }

    async getConsignments(pageIndex: number, limit: number) {
        const stats: any = await this.consignmentService.getConsignmentStats().toPromise()
            .catch(error => {
                this.dialogService.Error(error);
                return { totalItems: 100 };
            });
        this.pageStats.totalItems = stats.totalItems;
        const offset = pageIndex * this.pageStats.pageSize;
        return await this.consignmentService.getConsignments(offset, limit).toPromise()
            .catch(error => {
                this.dialogService.Error(error);
                return [];
            });
    }

    async getNextPage1(event: PageEvent) {
        this.isLoading = true;
        this.pageStats.pageIndex = event.pageIndex;
        this.consignments = await this.getConsignments(event.pageIndex, event.pageSize);
        this.isLoading = false;
    }

    async getNextPage(event: PageEvent) {
        await this.router.navigate(['consignments/page/' + (event.pageIndex + 1)]);
    }

    async gotoPage(page: number) {
        await this.router.navigate(['consignments/page/' + page]);
    }

    get totalPages() {
        return parseInt(Math.ceil(this.pageStats.totalItems / this.pageStats.pageSize).toString());
    }

    pagesArray(n: number): any[] {
        const pages = Array.from(Array(n).keys()).map((_, i) => i = i+1);
        return pages;
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

    getStatus(status: ConsignmentStatus) {
        return ConsignmentStatus[status];
    }

    setStatus(index: number, status: ConsignmentStatus) {
        this.dialogService.Confirm(`Are you sure about changing the status to '${ConsignmentStatus[status]}'?`)
            .then(result => {
                if (result.value) {
                    const consignment = this.consignments[index];
                    this.consignmentService.setStatus(consignment.Id, status)
                        .subscribe(data => {
                            if (data) {
                                this.dialogService.Alert('Status updated successfully')
                                    .then(() => consignment.Status = status);
                            }
                        }, error => this.dialogService.Error(error));
                }
            });
    }

    getStatusItems(currentStatus: ConsignmentStatus) {
        let statuses = this.filteredStatuses['Status_' + currentStatus];
        if (statuses) { return statuses; }
        statuses = [];
        Object.keys(ConsignmentStatus)
            .filter((type) => {
                let basicFilter = isNaN(<any>type) && type !== 'values';
                basicFilter = basicFilter && type !== ConsignmentStatus[currentStatus]; // exclude current status
                basicFilter = basicFilter && type !== ConsignmentStatus[ConsignmentStatus.New]; // exclude 'New' status

                if (currentStatus === ConsignmentStatus.New) { return false; }
                return basicFilter;
            })
            .forEach((item: any) => {
                const icon = item === ConsignmentStatus[ConsignmentStatus.Received] ? 'assignment_returned' :
                    item === ConsignmentStatus[ConsignmentStatus.Delivered] ? 'assignment_turned_in' :
                        item === ConsignmentStatus[ConsignmentStatus.OnTransit] ? 'local_shipping' :
                            item === ConsignmentStatus[ConsignmentStatus.New] ? 'assignment_late' :
                                'aspect_ratio';
                const status = { status: ConsignmentStatus[item], icon: icon };
                statuses.push(status);
            });
        this.filteredStatuses['Status_' + currentStatus] = statuses;
        return statuses;
    }

    addConsignment() {
        this.router.navigate(['consignments/add']);
    }

    viewConsignment(id: number) {
        this.router.navigate(['consignments/view', id]);
    }

    editConsignment(id: number) {
        this.router.navigate(['consignments/edit', id]);
    }

    deleteConsignment(index: number) {
        this.dialogService.Confirm('Are you sure about deleting this consignment?').then((result) => {
            if (result.value) {
                const id = this.consignments[index].Id;
                this.consignmentService.deleteConsignment(id)
                    .subscribe(() => {
                        this.consignments.splice(index, 1);
                        this.dialogService.Alert('Consignment deleted successfully');
                    }, error => this.dialogService.Error(error));
            }
        });
    }

    printConsignment(id: number) {
        window.open(`${Config.ApiRoot}/pdf/consignment/${id}`, '_blank');
    }

    paddedLRNumber(num: number) {
        if (num) {
            return Helpers.padLRNumber(num);
        }
        return '';
    }

    async searchConsignments() {
        if (this.searchText.value) {
            this.consignments = await this.consignmentService.searchConsignments({ text: this.searchText.value })
                .toPromise()
                .catch(error => {
                    this.dialogService.Error(error);
                    return [];
                });
            this.pageStats.pageIndex = 0;
            this.pageStats.totalItems = this.consignments.length;
            this.pageStats.pageSize = this.pageStats.totalItems;
            this.searched = true;
        }
    }

    clearSearch() {
        this.searchText.patchValue(null);
        this.searched = false;
        this.ngOnInit();
    }
}
