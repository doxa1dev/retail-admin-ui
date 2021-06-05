import { Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-button-loading',
  templateUrl: './button-loading.component.html',
  styleUrls: ['./button-loading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonLoadingComponent implements OnChanges {

 @Input() buttonName: string;
 @Input() disabledBtn: boolean;
 @Input() active: boolean;

  barButtonOptions: MatProgressButtonOptions= {
    active: false,
    text: this.buttonName,
    buttonColor: 'accent',
    barColor: 'primary',
    raised: true,
    stroked: false,
    fab: true,
    mode: 'indeterminate',
    value: 0,
    disabled: this.disabledBtn,
    // fullWidth: true,
    customClass: this.disabledBtn ? 'button-css btn-active' : 'button-css btn-disabled',
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.disabledBtn)){
      this.disabledBtn = changes.disabledBtn.currentValue;
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-add-to-cart btn-active' : 'btn-add-to-cart btn-disabled';
    }
    if (!isNullOrUndefined(changes.buttonName)){
      this.buttonName = changes.buttonName.currentValue
    }
    // if (this.buttonName === 'Add to cart'){
    //   // this.barButtonOptions.customClass = 'btn-add-to-cart';
    //   this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-add-to-cart btn-active' : 'btn-add-to-cart btn-disabled';
    // } else if (this.buttonName === 'Update'){
    //   this.barButtonOptions.customClass = this.disabledBtn ? 'button-css btn-active' : 'button-css btn-disabled';
    // }

    if (this.buttonName ===  "Add Assign Advisor"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-add-assign-advisor btn-active' : 'btn-add-assign-advisor btn-disabled';
    }

    if (this.buttonName ===  "Export"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-export btn-active' : 'btn-export btn-disabled';
    }

    if (this.buttonName ===  "Export "){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-export1 btn-active' : 'btn-export1 btn-disabled';
    }

    if (this.buttonName ===  " Export"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-export2 btn-active' : 'btn-export2 btn-disabled';
    }

    if(this.buttonName ===  "Submit"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-submit-customer btn-active' : 'btn-submit-customer btn-disabled';
    }

    if(this.buttonName ===  "Create Shipping Label"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-create-shipping-label btn-active' : 'btn-disable-create-shipping-label';
    }

    if(this.buttonName ===  "Mark As Verified"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-mark-as-verified btn-active' : 'btn-mark-as-verified btn-disabled';
    }

    if(this.buttonName ===  "Mark As Shipped/Collected"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-mark-as-verified btn-active' : 'btn-mark-as-verified btn-disabled';
    }
    if(this.buttonName ===  "Submit "){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-submit-advisor btn-active' : 'btn-submit-advisor-disabled btn-disabled';
    }

    if(this.buttonName ===  "Save"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-save-serial btn-active' : 'btn-save-serial btn-disabled';
    }

    this.barButtonOptions.text = this.buttonName;
    if (!isNullOrUndefined(changes.active)){
      if (!isNullOrUndefined(changes.buttonName)) {
        this.buttonName = changes.buttonName.currentValue;
        this.barButtonOptions.text = changes.buttonName.currentValue;

        // if(this.active === true){
        //   this.bathis.barButtonOptions.text = changes.buttonName.currentValue;rButtonOptions.customClass = 'button-css';
        // }
      }
      this.active = changes.active.currentValue;
      this.barButtonOptions.active = this.active;
      this.barButtonOptions.text = this.buttonName;
    }

    // this.barButtonOptions = {
    //   active: false,
    //   text: 'Update',
    //   buttonColor: 'accent',
    //   barColor: 'primary',
    //   raised: true,
    //   stroked: false,
    //   fab: true,
    //   mode: 'indeterminate',
    //   value: 0,
    //   disabled: this.disabledBtn,
    //   // fullWidth: true,
    //   customClass: this.disabledBtn ? 'button-css btn-active' : 'button-css btn-disabled'
    //   // buttonIcon: {
    //   //   fontIcon: 'favorite'
    //   // }
    // }
  }

  someFunc2(): void {
    // this.barButtonOptions.active = true;
    // this.barButtonOptions.text = 'Progress...';
    // setTimeout(() => {
    //   this.barButtonOptions.active = false;
    //   this.barButtonOptions.text = this.buttonName;
    // }, 2000)
  }

}
