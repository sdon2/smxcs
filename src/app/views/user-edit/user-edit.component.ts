import { OnInit, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserCommonComponent } from '../user-common/user-common.component';
import { RoleService } from 'src/app/services/role.service';
import { UserRole } from 'src/app/models/enums';
import { User } from 'src/app/models/user';
import { JwtDecodeService } from 'src/app/services/jwt.decode.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: '../user-common/user-common.component.html',
  styleUrls: ['../user-common/user-common.component.scss']
})
export class UserEditComponent extends UserCommonComponent implements OnInit {

  role: UserRole;

  constructor(
    public override router: Router,
    public route: ActivatedRoute,
    public override formBuilder: FormBuilder,
    public override dialogService: DialogService,
    private roleService: RoleService,
    private jwtService: JwtDecodeService,
    private tokenService: TokenService,
    public override userService: UserService) {
    super(router, formBuilder, userService, dialogService);
    this.role = this.roleService.getRole();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.title = 'Edit User';

    this.userForm.get('UserPassword').valueChanges.subscribe((value: string | any) => {
      if (value && value.length > 0) {
        this.userForm.get('UserPassword').setValidators(this.passwordValidators);
        this.userForm.get('CPassword').setValidators(this.cPasswordValidators);
      } else {
        this.userForm.get('UserPassword').clearValidators();
        this.userForm.get('CPassword').clearValidators();
      }
    });

    this.route.paramMap
      .subscribe(params => {
        const id = parseInt(params.get('id') ?? '');
        this.userService.getUser(id)
          .subscribe(data => {
            if (!this.canEditUser(data)) {
              this.dialogService.Error('Invalid operation').then(() => {
                this.router.navigate(['users']);
              });
              return;
            }
            this.userForm.reset();
            this.userForm.patchValue({
              Id: data.Id,
              Fullname: data.Fullname,
              Username: data.Username,
              UserPassword: null,
              CPassword: null,
              UserRole: data.UserRole
            });
          }, error => this.dialogService.Error(error).then(() => this.router.navigate(['users'])));
      });
  }

  canEditUser(user: User) {
    if (this.role == UserRole.Admin) {
      if (user.UserRole != UserRole.Admin) { return true; }
    }
    if (this.role == UserRole.Owner) {
      if (user.UserRole != UserRole.Admin && user.UserRole == UserRole.Owner && user.Id == this.jwtService.getFieldFromToken('id')) { return true; }
    }
    return false;
  }

  saveUser() {
    if (this.userForm.valid) {
      const saveFunction = this.userService.updateUser(this.userForm.value);
      saveFunction.subscribe((data) => {
        if (data.reLogin) {
          this.dialogService.Alert('User saved successfully. You need to login again. Logging you out..')
            .then(() => {
              this.tokenService.removeAuthToken();
              this.router.navigate(['login']);
            });
        } else {
          this.dialogService.Alert('User saved successfully')
            .then(() => this.router.navigate(['users']));
        }
      }, error => this.dialogService.Error(error));
    } else {
      this.userForm.markAsTouched;
    }
  }
}
