import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-formatter-cell',
  templateUrl: './image-formatter-cell.component.html',
  styleUrls: ['./image-formatter-cell.component.scss']
})
export class ImageFormatterCellComponent implements OnInit {

  @Input() params: any;
  constructor() { }

  ngOnInit(): void {
  }

}
