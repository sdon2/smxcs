import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consignment } from 'src/app/models/consignment';
import { ConsignmentService } from 'src/app/services/consignment.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Helpers } from '../helpers';

@Component({
    selector: 'app-select-consignments-dialog',
    templateUrl: './select-consignments-dialog.component.html',
    styleUrls: ['./select-consignments-dialog.component.scss']
})
export class SelectConsignmentsDialogComponent implements OnInit {

    public _loadedConsignments: Consignment[] = [];

    constructor(
        private consignmentService: ConsignmentService,
        private dialogService: DialogService,
        public dialogRef: MatDialogRef<SelectConsignmentsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Consignment[]) {
        data.forEach(item => this._loadedConsignments.push(item));
    }

    ngOnInit() {
        this.consignmentService.getUncompletedConsignments()
            .subscribe(items => {
                items.forEach(item => {
                    if (!this.data.find(i => i.Id == item.Id)) { this._loadedConsignments.push(item); }
                });
            }, error => this.dialogService.Error(error));
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    padLRNumber(number: any) {
        return Helpers.padLRNumber(number);
    }

    onOkClick(): void {
        this.dialogRef.close(this.data);
    }

    toggleConsignment(item: Consignment) {
        const selectedIndex = this.findSelectedIndex(item);
        if (selectedIndex != -1) {
            this.data.splice(selectedIndex, 1);
        } else {
            this.data.push(item);
        }
    }

    findSelectedIndex(item: Consignment): number {
        return this.data.findIndex(con => con.Id == item.Id);
    }

    setStyle(item: Consignment) {
        const selected = this.findSelectedIndex(item) !== -1;
        return {
            'background': selected ? '#002a77' : '#ffffff',
            'color': selected ? '#ffffff' : '#000000',
            'cursor': 'pointer'
        };
    }

}
