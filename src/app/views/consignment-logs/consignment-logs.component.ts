import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { ConsignmentLog } from 'src/app/models/consignment-log';
import { ConsignmentLogService } from 'src/app/services/consignment-log.service';
import { RoleService } from 'src/app/services/role.service';
import { UserRole } from 'src/app/models/enums';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Helpers } from 'src/app/common/helpers';

@Component({
  selector: 'app-consignment-logs',
  templateUrl: './consignment-logs.component.html',
  styleUrls: ['./consignment-logs.component.scss']
})
export class ConsignmentLogsComponent implements OnInit {

  consignmentLogs: ConsignmentLog[] | any = [];
  role!: UserRole;

  pageStats: { totalItems?: number, pageIndex?: number, pageSize?: number } | any = {};

  searched = false;
  searchText: FormControl = new FormControl(null);

  constructor(
    private dialogService: DialogService,
    private consignmentLogService: ConsignmentLogService,
    private roleService: RoleService,
    private router: Router) { }

  initPageStats() {
    this.pageStats.pageIndex = 0;
    this.pageStats.pageSize = 25;
    this.pageStats.totalItems = 100;
  }

  async ngOnInit() {
    this.role = this.roleService.getRole();
    this.initPageStats();
    this.consignmentLogs = await this.getConsignmentLogs(this.pageStats.pageIndex, this.pageStats.pageSize);
  }

  canDeleteLogs() {
    return this.role == UserRole.Admin || this.role == UserRole.Owner;
  }

  async getConsignmentLogs(pageIndex: number, limit: number) {
    const stats: any = await this.consignmentLogService.getConsignmentLogStats().toPromise()
      .catch(error => {
        this.dialogService.Error(error);
        return { totalItems: 100 };
      });
    this.pageStats.totalItems = stats.totalItems;
    const offset = pageIndex * this.pageStats.pageSize;
    return await this.consignmentLogService.getConsignmentLogs(offset, limit).toPromise()
      .catch(error => {
        this.dialogService.Error(error);
        return [];
      });
  }

  async getNextPage(event: PageEvent) {
    this.pageStats.pageIndex = event.pageIndex;
    this.consignmentLogs = await this.getConsignmentLogs(event.pageIndex, event.pageSize);
  }

  paddedLRNumber(num: number) {
    if (num) {
      return Helpers.padLRNumber(num);
    }
    return '';
  }

  async searchConsignmentLogs() {
    if (this.searchText.value) {
      this.consignmentLogs = await this.consignmentLogService.searchConsignmentLogs({ text: this.searchText.value })
        .toPromise()
        .catch(error => {
          this.dialogService.Error(error);
          return [];
        });
      this.pageStats.pageIndex = 0;
      this.pageStats.totalItems = this.consignmentLogs.length;
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
