import { Component, AfterViewInit, OnInit } from '@angular/core';
import { tap, delay } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { HttpActivityService } from './services/http-activity.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-spinner class="spinner" strokeWidth="5" diameter="50" [hidden]="!httpActivity"></mat-spinner>
    <div [hidden]="httpActivity" class="mat-typography">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spinner {
      margin: 0 auto;
      margin-top: 15%;
    }`
  ]
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'Sri Meenakshi Xpress Cargo Service';
  httpActivity: boolean = false;

  constructor(private httpActivityService: HttpActivityService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }

  ngAfterViewInit() {
    this.httpActivityService.activity
      .pipe(
        delay(0),
        tap(status => {
          // console.log(status);
          this.httpActivity = status;
        })
      )
      .subscribe();
  }
}
