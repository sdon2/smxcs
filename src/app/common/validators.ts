import { ValidatorFn, AbstractControl } from '@angular/forms';

/*
export function BasicValidator(control: AbstractControl): { [key: string]: boolean } | null {
  return null;
}
*/

export function MismatchValidator(comparableControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const form = control.parent;
        if (form) {
            return control.value !== form.get(comparableControlName).value ? { 'mismatch': true } : null;
        }
        return null;
    };
}
