import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService
{

    private message = new BehaviorSubject([] as any);
    
    sharedMessage = this.message.asObservable();
    
    constructor() { }

    nextCart(array_list )
    {
        this.message.next(array_list)
    }


}