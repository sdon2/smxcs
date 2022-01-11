import { OnInit, Directive } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ConsignorService } from 'src/app/services/consignor.service';
import { ConsigneeService } from 'src/app/services/consignee.service';
import { RoleService } from 'src/app/services/role.service';
import { UserRole } from 'src/app/models/enums';

@Directive()
export abstract class CustomersComponent implements OnInit {

  isConsignor = false;
  customerType: string = null;
  customers: any[] = [];
  isLoading = true;
  pageStats: { totalItems?: number, pageIndex?: number, pageSize?: number } = {};

  searched = false;
  searchText: FormControl = new FormControl(null);
  role: UserRole;

  canEdit: boolean;
  canDelete: boolean;

  constructor(
    public dialogService: DialogService,
    public consignorService: ConsignorService,
    public consigneeService: ConsigneeService,
    public roleService: RoleService,
    public router: Router) {
      this.role = this.roleService.getRole();
      this.canEdit = this.role == UserRole.Admin || this.role == UserRole.Owner;
      this.canDelete = this.role == UserRole.Admin || this.role == UserRole.Owner;
    }

  initPageStats() {
    this.pageStats.pageIndex = 0;
    this.pageStats.pageSize = 25;
    this.pageStats.totalItems = 100;
  }

  async ngOnInit() {
    this.isLoading = true;
    this.initPageStats();
    this.customers = await this.getCustomers(this.pageStats.pageIndex, this.pageStats.pageSize);
    this.isLoading = false;
  }

  async getCustomers(pageIndex: number, limit: number) {
    const statsFunction = this.isConsignor ? this.consignorService.getConsignorStats() : this.consigneeService.getConsigneeStats();
    const stats = await statsFunction.toPromise()
      .catch(error => {
        this.dialogService.Error(error);
        return { totalItems: 100 };
      });
    this.pageStats.totalItems = stats.totalItems;
    const offset = pageIndex * this.pageStats.pageSize;
    const loadFunction = this.isConsignor ? this.consignorService.getConsignors(offset, limit) : this.consigneeService.getConsignees(offset, limit);
    return await loadFunction.toPromise()
      .catch(error => {
        this.dialogService.Error(error);
        return [];
      });
  }

  async getNextPage(event: PageEvent) {
    this.isLoading = true;
    this.pageStats.pageIndex = event.pageIndex;
    this.customers = await this.getCustomers(event.pageIndex, event.pageSize);
    this.isLoading = false;
  }

  addCustomer() {
    this.router.navigate([this.customerType.toLowerCase() + 's/add']);
  }

  editCustomer(id: number) {
    this.router.navigate([this.customerType.toLowerCase() + 's/edit', id]);
  }

  deleteCustomer(index: number) {
    this.dialogService.Confirm(`Are you sure about deleting this ${this.customerType.toLowerCase()}?`).then((result) => {
      if (result.value) {
        const id = this.customers[index].Id;
        const deleteFunction = this.isConsignor ? this.consignorService.deleteConsignor(id) : this.consigneeService.deleteConsignee(id);
        deleteFunction
        .subscribe(() => {
          this.customers.splice(index, 1);
          this.dialogService.Alert(this.customerType + ' deleted successfully');
        }, error => this.dialogService.Error(error));
      }
    });
  }

  async searchCustomers() {
    if (this.searchText.value) {
      const searchFunction = this.isConsignor ? this.consignorService.searchConsignors({ text: this.searchText.value }) : this.consigneeService.searchConsignees({ text: this.searchText.value });
      this.customers = await searchFunction
        .toPromise()
        .catch(error => {
          this.dialogService.Error(error);
          return [];
        });
        this.pageStats.pageIndex = 0;
        this.pageStats.totalItems = this.customers.length;
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
