import { OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MismatchValidator } from 'src/app/common/validators';
import { UserService } from 'src/app/services/user.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserRole } from 'src/app/models/enums';

@Directive()
export abstract class UserCommonComponent implements OnInit {

  public title: string | null = null;
  userForm: FormGroup | any = null;
  public userRoles: { text:string, value: string }[] = [];

  protected passwordValidators = [Validators.required, Validators.pattern(/[^\s\\]/), Validators.minLength(6), Validators.maxLength(20)];
  protected cPasswordValidators = [Validators.required, MismatchValidator('UserPassword')];

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public dialogService: DialogService) {
      Object.keys(UserRole)
        .filter((type) => isNaN(<any>type) && type !== 'values')
        .forEach(item => {
          this.userRoles.push({ text: item, value: UserRole[(item as unknown) as number] });
        });
    }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      Id: [null],
      Fullname: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9_]/), Validators.minLength(3), Validators.maxLength(12)]],
      Username: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9_]/), Validators.minLength(3), Validators.maxLength(12)]],
      UserPassword: [null, this.passwordValidators],
      CPassword: [null, this.cPasswordValidators],
      UserRole: [null, [Validators.required]]
    });
  }

  _f(fieldName: string): any {
    if (this.userForm) {
      return this.userForm.get(fieldName);
    }
  }
}
