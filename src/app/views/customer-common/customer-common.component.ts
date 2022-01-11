import { OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Directive()
export abstract class CustomerCommonComponent implements OnInit {

  public title: string | any = null;
  public customerType: string | any = null;
  isConsignor = false;
  cForm: FormGroup | any;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cForm = this.formBuilder.group({
      Id: [null],
      Name: [null, [Validators.required]],
      Address: [null, [Validators.required]],
      Address1: [null],
      City: [null, [Validators.required]],
      State: [null, [Validators.required]],
      Pincode: [null, [Validators.required]],
      Mobile: [null, [Validators.required, Validators.pattern('[0-9]{10}')]],
      GSTNo: [null, [Validators.required]],
      FreightCharge: [0, [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
      BasedOn: ['article', [Validators.required]], // Article/Weight (Per Kg)
      PaymentTerms: [2, [Validators.required]],
      Remarks: [null]
    });
  }

  _f(fieldName: string): any {
    return this.cForm.get(fieldName);
  }
}
