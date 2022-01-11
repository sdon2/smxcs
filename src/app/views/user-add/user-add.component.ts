import { OnInit, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserCommonComponent } from '../user-common/user-common.component';

@Component({
  selector: 'app-user-add',
  templateUrl: '../user-common/user-common.component.html',
  styleUrls: ['../user-common/user-common.component.scss']
})
export class UserAddComponent extends UserCommonComponent implements OnInit {

  constructor(
    public override router: Router,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    public override userService: UserService) {
      super(router, formBuilder, userService, dialogService);
    }

  override ngOnInit() {
    super.ngOnInit();
    this.title = 'Add User';
  }

  saveUser() {
    if (this.userForm.valid) {
      const saveFunction = this.userService.saveUser(this.userForm.value);
      saveFunction.subscribe(() => {
        this.dialogService.Alert('User saved successfully')
        .then(() => this.router.navigate(['users']));
      }, error => this.dialogService.Error(error));
    } else {
      this.userForm.markAsTouched;
    }
  }
}
