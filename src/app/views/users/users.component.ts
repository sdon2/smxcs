import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/enums';
import { RoleService } from 'src/app/services/role.service';
import { JwtDecodeService } from 'src/app/services/jwt.decode.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[]|any = [];
  isLoading = true;
  role: UserRole;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private roleService: RoleService,
    private jwtService: JwtDecodeService,
    private router: Router) {
    this.role = this.roleService.getRole();
  }

  async ngOnInit() {
    this.isLoading = true;
    this.users = await this.userService.getUsers().toPromise()
      .catch(error => {
        this.dialogService.Alert(error);
        return [];
      });
    this.isLoading = false;
  }

  addUser() {
    this.router.navigate(['users/add']);
  }

  canEditUser(user: User) {
    if (this.role == UserRole.Admin) {
      if (user.UserRole != UserRole.Admin) { return true; }
    }
    if (this.role == UserRole.Owner) {
      if (user.UserRole == UserRole.Admin) {
        return false;
      } else if (user.UserRole == UserRole.Owner && user.Id == this.jwtService.getFieldFromToken('id')) {
        return true;
      } else if (user.UserRole == UserRole.Accountant || user.UserRole == UserRole.Branch) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  canDeleteUser(user: User) {
    if (this.role == UserRole.Admin) {
      if (user.UserRole != UserRole.Admin) { return true; }
    }
    if (this.role == UserRole.Owner) {
      if (user.UserRole != UserRole.Admin && user.UserRole != UserRole.Owner) { return true; }
    }
    return false;
  }

  editUser(index: number) {
    const user = this.users[index];
    if (user) {
      if (!this.canEditUser(user)) {
        this.dialogService.Error('Cannot edit admin/owner user');
        return;
      }
      const id = user.Id;
      this.router.navigate(['users/edit', id]);
    }
  }

  getUserRole(role: UserRole) {
    return UserRole[role];
  }

  deleteUser(index: number) {
    const user = this.users[index];
    if (!user) { return; }
    if (!this.canDeleteUser(user)) {
      this.dialogService.Error('Cannot delete admin/owner user');
      return;
    }
    this.dialogService.Confirm(`Are you sure about deleting this user?`).then((result) => {
      if (result.value) {
        const id = user.Id;
        this.userService.deleteUser(id)
          .subscribe(() => {
            this.users.splice(index, 1);
            this.dialogService.Alert('User deleted successfully');
          }, error => this.dialogService.Error(error));
      }
    });
  }
}
