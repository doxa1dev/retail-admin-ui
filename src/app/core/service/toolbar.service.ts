import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: "root",
})

export class ToolbarService {
  constructor() {}

    new_photo_key='';
    // tslint:disable-next-line: no-output-native
    @Output() change: EventEmitter<string> = new EventEmitter();

    changeUserMenuPhoto(newPhotoKey: string){

        this.new_photo_key=newPhotoKey;
        this.change.emit(this.new_photo_key);
    }
}
