import { Component, OnInit } from '@angular/core';
import { OGPList } from 'src/app/models/ogp-list';
import { DialogService } from 'src/app/services/dialog.service';
import { OGPListService } from 'src/app/services/ogplist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Config } from 'src/app/app.config';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { UserRole } from 'src/app/models/enums';

@Component({
  selector: 'app-ogp-lists',
  templateUrl: './ogp-lists.component.html',
  styleUrls: ['./ogp-lists.component.scss']
})
export class OgpListsComponent implements OnInit {

  ogpLists: any[] = [];
  isLoading = true;
  pageStats: { totalItems?: number, pageIndex?: number, pageSize?: number } = {};

  searched = false;
  searchText: FormControl = new FormControl(null);

  role: UserRole;
  canAdd: boolean;
  canView: boolean;
  canEdit: boolean;
  canPrint: boolean;
  canDelete: boolean;

  manualPage: number;

  constructor(
    private dialogService: DialogService,
    private ogpListService: OGPListService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute) {
      this.role = this.roleService.getRole();
      this.canAdd = this.role == UserRole.Admin || this.role == UserRole.Owner || this.role == UserRole.Accountant;
      this.canView = this.canAdd;
      this.canEdit = this.canAdd;
      this.canPrint = this.canEdit;
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
    this.route.params.subscribe(async params => {
      const page = parseInt(params['page']);
      if (!isNaN(page)) {
        this.manualPage = page;
        this.pageStats.pageIndex = (page - 1);
      }
      this.ogpLists = await this.getOGPs(this.pageStats.pageIndex, this.pageStats.pageSize);
    });
    this.isLoading = false;
  }

  async getOGPs(pageIndex: number, limit: number) {
    const stats = await this.ogpListService.getOGPStats().toPromise()
      .catch(error => {
        this.dialogService.Error(error);
        return { totalItems: 100 };
      });
    this.pageStats.totalItems = stats.totalItems;
    const offset = pageIndex * this.pageStats.pageSize;
    return await this.ogpListService.getOGPs(offset, limit).toPromise()
      .catch(error => {
        this.dialogService.Error(error);
        return [];
      });
  }

  async getNextPage1(event: PageEvent) {
    this.isLoading = true;
    this.pageStats.pageIndex = event.pageIndex;
    this.ogpLists = await this.getOGPs(event.pageIndex, event.pageSize);
    this.isLoading = false;
  }

  async getNextPage(event: PageEvent) {
    await this.router.navigate(['ogp-lists/page/' + (event.pageIndex + 1)]);
  }

  async gotoPage(page: number) {
    await this.router.navigate(['ogp-lists/page/' + page]);
  }

  get totalPages() {
    return parseInt(Math.ceil(this.pageStats.totalItems / this.pageStats.pageSize).toString());
  }

  pagesArray(n: number): any[] {
    const pages = Array.from(Array(n).keys()).map((_, i) => i = i+1);
    return pages;
  }

  addOGPList() {
    this.router.navigate(['ogp-lists/add']);
  }

  viewOGPList(id: number) {
    this.router.navigate(['ogp-lists/view', id]);
  }

  editOGPList(id: number) {
    this.router.navigate(['ogp-lists/edit', id]);
  }

  deleteOGPList(index: number) {
    this.dialogService.Confirm('Are you sure about deleting this OGP List?').then((result) => {
      if (result.value) {
        const id = this.ogpLists[index].Id;
        this.ogpListService.deleteOGPList(id)
        .subscribe(() => {
          this.ogpLists.splice(index, 1);
          this.dialogService.Alert('OGP List deleted successfully');
        }, error => this.dialogService.Error(error));
      }
    });
  }

  printOGPList(id: number) {
    window.open(`${Config.ApiRoot}/pdf/ogplist/${id}`, '_blank');
  }

  async searchOgpLists() {
    if (this.searchText.value) {
      this.ogpLists = await this.ogpListService.searchOgpLists({ text: this.searchText.value })
        .toPromise()
        .catch(error => {
          this.dialogService.Error(error);
          return [];
        });
        this.pageStats.pageIndex = 0;
        this.pageStats.totalItems = this.ogpLists.length;
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
