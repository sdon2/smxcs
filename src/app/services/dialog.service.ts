import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    Confirm(
        message: string,
        title: string = 'Confirm',
        mbType: MessageBoxTypes = MessageBoxTypes.Info,
        showCancelButton: boolean = true) {
        const options = {
            title,
            html: message,
            icon: mbType,
            showCancelButton,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        } as SweetAlertOptions;
        return Swal.fire(options);
    }

    Alert(
        message: string,
        title: string = 'Alert',
        mbType: MessageBoxTypes = MessageBoxTypes.Info) {
        return Swal.fire(title, message, mbType);
    }

    Error(
        message: string,
        title: string = 'Error',
        mbType: MessageBoxTypes = MessageBoxTypes.Error) {
        return Swal.fire(title, message, mbType);
    }
}

export enum MessageBoxTypes {
    Warning = 'warning',
    Info = 'info',
    Error = 'error'
}
