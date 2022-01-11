import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpActivityService {

    private activityStorage = new BehaviorSubject<boolean>(false);
    public activity = this.activityStorage.pipe(distinctUntilChanged());

    setActivity(activity: boolean) {
        this.activityStorage.next(activity);
    }
}
