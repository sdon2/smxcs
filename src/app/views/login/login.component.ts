import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;

  error: string = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService
    ) {
      this.userForm = this.formBuilder.group({
        Username: [null, Validators.required],
        UserPassword: [null, Validators.required]
      });
    }

  ngOnInit() {
    const token = this.tokenService.getAuthToken();
    if (token) {
      this.router.navigate(['consignments']);
    }
  }

  Login() {
    if (this.userForm.valid) {
      this.userService.login(this.userForm.value)
      .subscribe((data) => {
        this.tokenService.setAuthToken(data.token);
        this.router.navigate(['consignments']);
        return;
      }, error => this.error = error);
    }
  }

}
