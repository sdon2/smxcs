import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public title = null;
  public customerType = null;
  isConsignor = false;
  LRPrintSettings: FormGroup;

  constructor(
    public router: Router,
    public settingService: SettingService,
    public dialogService: DialogService,
    public formBuilder: FormBuilder) { }

  ngOnInit() {
    const numberPattern = /^\d+(.\d+)?$/;
    this.LRPrintSettings = this.formBuilder.group({
      Height: [0, [Validators.required, Validators.pattern(numberPattern)]],
      Width: [0, [Validators.required, Validators.pattern(numberPattern)]],
      LeftMargin: [0, [Validators.required, Validators.pattern(numberPattern)]],
      RightMargin: [0, [Validators.required, Validators.pattern(numberPattern)]],
      TopMargin: [0, [Validators.required, Validators.pattern(numberPattern)]],
      BottomMargin: [0, [Validators.required, Validators.pattern(numberPattern)]],
    });

    this.settingService.getSetting({ name: 'LRPrintOptions' })
      .subscribe(data => {
        if (data == null) { return; }
        this.LRPrintSettings.patchValue({
          Height: data.Height,
          Width: data.Width,
          LeftMargin: data.LeftMargin,
          RightMargin: data.RightMargin,
          TopMargin: data.TopMargin,
          BottomMargin: data.BottomMargin,
        });
      }, error => this.dialogService.Error(error));
  }

  _f(fieldName: string): AbstractControl {
    return this.LRPrintSettings.get(fieldName);
  }

  saveSettings() {
    if (this.LRPrintSettings.valid) {
      this.settingService.saveSetting({ name: 'LRPrintOptions', data: this.LRPrintSettings.value })
      .subscribe(() => {
        this.dialogService.Alert('Settings saved successfully');
      }, error => this.dialogService.Error(error));
    } else {
      this.LRPrintSettings.markAsTouched();
    }
  }
}
