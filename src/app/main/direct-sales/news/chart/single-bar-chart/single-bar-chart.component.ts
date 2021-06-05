import { Component, OnInit, Input , ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { format } from 'path';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-single-bar-chart',
  templateUrl: './single-bar-chart.component.html',
  styleUrls: ['./single-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingleBarChartComponent implements OnChanges {

  @Input()
  DataNew: NewDatas[];

  private margin = {top: 20, right: 15, bottom: 20, left: 10};
  private width: number;
  private height: number;
  private x: any;
  private x1: any;
  private y: any;
  private svg: any;
  private area: any;
  private g: any;
  max: any;
  color = "#F6B041";
  id: string;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.DataNew.currentValue)){
      this.DataNew = changes.DataNew.currentValue;

        if(this.DataNew){
          this.initSvgAllReaches();
          this.initAxis(this.DataNew);
          this.drawAxis();
          this.drawBars(this.DataNew, this.color);
        }

    }
  }

  private initSvgAllReaches() {
    d3.selectAll(".singleBarChart > *").remove();
    this.svg = d3.select(".singleBarChart");
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(dataNews) {
    // this.max = D3.max(dataNews, (d:any)=> d.totalCustomer);
    this.max = Number(D3.max(dataNews, (d:any)=> d.totalCustomer))>0 ? D3.max(dataNews, (d:any)=> d.totalCustomer): 10;
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.x1 = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleBand().rangeRound([this.height , 0]);
    this.x.domain([0, this.max ]);
    this.y.domain(dataNews.map((d) => d.date));
    this.x1.domain([0,1])
  }

  private drawAxis() {
    this.g.append('g')
        .attr('class', 'axis axis--x2')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x).ticks(2).tickValues([0,this.max]).tickSize(-this.height-3));
    this.g.append('g')
        .attr('class', 'axis axis--x3')
        .attr('transform', 'translate(0,-3)')
        .call(d3Axis.axisTop(this.x1).ticks(1,'%'))
    this.g.append('g')
        .attr('class', 'axis axis--y2')
        .call(d3Axis.axisLeft(this.y))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')

  }

  private drawBars(dataNews , color) {
    this.g.selectAll('.bar')
        .data(dataNews)
        .enter().append('rect')
        .attr('class', 'bar')
        .style("fill", color)
        .attr('y', (d) => this.y(d.date) )
        .attr('height', this.y.bandwidth() - 3 )
          .attr('x',(d) => this.x(0) +3)
          .attr("width",0)
            .transition()
            .duration(1750)
            .delay(1000)
        .attr('x', (d) => this.x(0) +3 )
        .attr('width', (d) => d.totaldata !=0 ? (this.x(d.totaldata)-6) : this.x(d.totaldata)  );


    this.g.append('g')
        .classed('labels-group', true)
        .selectAll('text')
        .data(dataNews)
        .enter()
        .append('text')
        .classed('label',true)
          .attr("x", (d:any)=> this.x(d.totaldata)+10)
          .attr("y", (d: any) =>this.y(d.date)+22)
          .attr('text-anchor', 'middle')
          .attr('fill', '#5A616F')
          .attr('font-size', '14px')
          .transition()
          .duration(1750)
          .delay(3000)
          .text((d: any) => d.totaldata);

  }


}



export class NewDatas{
  totalCustomer: number;
  totaldata: number;
  date: string
}
