import { Component , OnInit } from '@angular/core';

@Component({
  selector: 'active-cell',
  templateUrl:'./active-cell.component.html',
  styleUrls: ['./active-cell.component.scss'],
})

export class ActiveCellCustomComponent implements OnInit{

  constructor(){}
  active: any;

  agInit(params){
    this.active = params.value;
  }

  ngOnInit(){

  }
}
