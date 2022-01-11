import { AbstractControl } from '@angular/forms';

export function MinimumAmountValidator(control: AbstractControl): { [key: string]: any } | null {
    return parseFloat(control.value) <= 0 ? { 'isZero': { value: control.value } } : null;
}
