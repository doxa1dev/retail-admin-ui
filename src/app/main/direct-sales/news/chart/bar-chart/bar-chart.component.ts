import { Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnChanges {

    @Input()
    DataNews: NewsDataViews[];

    private margin = {top: 20, right: 0, bottom: 20, left: 0};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private area: any;
    private g: any;
    firstDate: any;
    lastDate: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {

    if (!changes.DataNews.firstChange && !isNullOrUndefined(changes.DataNews.currentValue)){
      this.DataNews = changes.DataNews.currentValue;
      if(this.DataNews){
        this.initSvg();
        this.initAxis(this.DataNews);
        this.drawAxis();
        this.drawBars(this.DataNews)
      }
    }
  }

  private initSvg() {
    d3.selectAll("#svgBarChart > *").remove();
    this.svg = d3.select('#svgBarChart');
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(dataNews) {
    this.firstDate = dataNews[0].date;
    this.lastDate = dataNews[6].date;
    let max = Number(d3Array.max(dataNews, (d:any) => d.totalViews ))> 0 ? d3Array.max(dataNews, (d:any) => d.totalViews ): 10;
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(dataNews.map((d) => d.date));
    this.y.domain([0, max]);
  }

  private drawAxis() {
    this.g.append('g')
        .attr('class', 'axis axis--x1')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
        .attr('class', 'axis axis--y1')
        .call(d3Axis.axisLeft(this.y))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');
  }

  private drawBars(dataNews) {
    this.g.selectAll('.bar')
        .data(dataNews)
        .enter().append('rect')
        .attr('class', 'bar')
        .style("fill","#0A73EB")
        .attr('x', (d) => this.x(d.date) )
        .attr('width', this.x.bandwidth())
          .attr("y", d=>{ return this.height})
          .attr("height",0)
            .transition()
            .duration(750)
            .delay(1000)
        .attr('y', (d) => this.y(d.totalViews) )
        .attr('height', (d) => this.height - this.y(d.totalViews) );

    this.g.append('g')
        .classed('labels-group', true)
        .selectAll('text')
        .data(dataNews)
        .enter()
        .append('text')
        .classed('label',true)
          .style("display",  d => { return d.totalViews === 0 ? "none" : null; })
          .attr("x", (d:any)=> this.x(d.date)+25 )
          .attr("y", (d: any) =>this.y(d.totalViews))
          .attr("dy", "-.5em")
          .attr('text-anchor', 'middle')
          .attr('fill', '#5A616F')
          .attr('font-size', '14px')
          .transition()
          .duration(750)
          .delay(2000)
          .text((d: any) => d.totalViews)
  }
}

export class NewsDataViews{
  totalViews: number;
  date: string
}
