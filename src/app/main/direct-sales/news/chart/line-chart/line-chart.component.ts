import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnChanges, ViewEncapsulation, SimpleChange, SimpleChanges } from '@angular/core';
import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
// import {STOCKS , DataNews} from 'assets/data'
import { transition } from 'd3-transition';
import { formatDate } from '@angular/common';
import { tick } from '@angular/core/testing';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnChanges  {


    @Input()
    DataNews: NewsData[];

    maxdate = new Date();
    weekdate: Date = new Date();
    dataNewsToPlot: NewsData[];
    date: string;

    private margin = {top: 20, right: 0, bottom: 30, left: 0};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private area: any;
    private lineView: d3Shape.Line<[number, number]>;
    private lineReach: d3Shape.Line<[number, number]>;
    private chartProps: any;

  constructor() {
    this.width = 1100 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.DataNews.firstChange && !isNullOrUndefined(changes.DataNews.currentValue)){
      this.DataNews = changes.DataNews.currentValue;
      this.weekdate.setDate(this.maxdate.getDate()-6)
      if(this.DataNews){
        this.initSvg();
        this.initAxis(this.DataNews);
        this.drawAxis();
        this.drawLine(this.DataNews);
      }
    }

  }

  initSvg() {
    d3.selectAll("#svgChart > *").remove();
    this.svg = d3.select('#svgChart')
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }


  initAxis(DataNews) {
    let max = (Number(D3.max(DataNews, (d:any) => d.totalReaches ))> 0) ? Number(D3.max(DataNews, (d:any) => d.totalReaches )) : 10 ;
    this.x = d3Scale.scaleBand().range([0, this.width*0.95]).padding(1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(DataNews.map(function(d){ return d.date}));
    this.y.domain([0, max]);
  }

  drawAxis() {

    this.svg.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(
          d3Axis.axisBottom(this.x)
          .ticks(7)
          .tickSize(-this.height-10)
          );

    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y).ticks(5))

    this.svg.selectAll(".axis text")  // select all the text elements for the xaxis
        .attr("transform", "translate(0,10)");
  }

  drawLine(DataNews) {
    var x1 = d3Scale.scaleBand().range([0, this.width*0.95]).padding(1);
    var y1 = d3Scale.scaleLinear().rangeRound([this.height, 0]);

    let max1 = (Number(D3.max(DataNews, (d:any) => d.totalReaches ))> 0) ? Number(D3.max(DataNews, (d:any) => d.totalReaches )) : 10 ;
    x1.domain(DataNews.map(function(d){ return d.date}));
    y1.domain([0, max1])

    this.lineView = D3.line()
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(d.totalViews) );

    this.lineReach = D3.line()
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(d.totalReaches) );

    // draw line reaches-------------------------------------------------------
    // var line = this.svg.append('path')
    //     .datum(DataNews)
    //     .attr('class', 'line line2')
    //     .attr("stroke-width", 1)
    //     .attr('d', this.lineReach);
    // var totalLength = line.node().getTotalLength();
    const transitionPath = D3
      .transition()
      .ease(D3.easeSin)
      .duration(2660);
    // line
    //   .attr("stroke-dashoffset", totalLength)
    //   .attr("stroke-dasharray", totalLength)
    //   .transition(transitionPath)
    //   .attr("stroke-dashoffset", 0)
        //-------------------------------------------------------------------------

    // define the area
    var area = function (datum, boolean, height) {
      return (D3.area()
        .x( (d: any) => x1(d.date))
        .y0(height)
        .y1((d:any) =>  boolean ? y1(d.totalReaches) : y1(0) ))(datum);
    };

    this.svg.append("path")
        .data([DataNews])
        .attr("class", "area")
        .attr("fill", "#9DD696")
        .attr("stroke", "none")
        .attr("d", (d:any) => area(d, false, this.height))
        .transition()
        .duration(2660)
        .attr("d", (d:any) => area(d, true, this.height));

    //draw line views---------------------------------------------------------------
    var line1 = this.svg.append('path')
          .datum(DataNews)
          .attr('class', 'line line1')
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr('d', this.lineView)

    var totalLength2 = line1.node().getTotalLength()
    line1
      .attr("stroke-dashoffset", totalLength2)
      .attr("stroke-dasharray", totalLength2)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0)


    //cycle of each point ---------------------------------------
    this.svg.selectAll("myCircles")
        .data(DataNews)
        .enter()
        .append("circle")
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("cx", (d:any)=> this.x(d.date) )
          .attr("cy", (d: any) => this.y(d.totalReaches))
            .transition()
            .duration(1000)
            .delay(2660)
          .attr("r", 5)



    this.svg.selectAll("myCircles")
        .data(DataNews)
        .enter()
        .append("circle")
          .attr("fill", "#5B7D47")
          .attr("stroke", "none")
          .attr("cx", (d:any)=> this.x(d.date) )
          .attr("cy", (d: any) => this.y(d.totalViews))
            .transition()
            .duration(1000)
            .delay(2660)
          .attr("r", 5)


    // display data on each line------------------------------------------------------
    this.svg.append('g')
      .classed('labels-group', true)
      .selectAll('text')
      .data(DataNews)
      .enter()
      .append('text')
      .classed('label',true)
        .style("display",  d => { return d.totalViews === 0 ? "none" : null; })
        .attr("x", (d:any)=> this.x(d.date) )
        .attr("y", (d: any) => this.y(d.totalViews)-10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#5B7D47')
        .attr('font-size', '14px')
        .transition()
        .duration(1000)
        .delay(2660)
        .text((d: any) => d.totalViews)

    this.svg.append('g')
        .classed('labels-group', true)
        .selectAll('text')
        .data(DataNews)
        .enter()
        .append('text')
        .classed('label',true)
          .attr("x", (d:any)=> this.x(d.date) )
          .attr("y", (d: any) => this.y(D3.max(DataNews,(d:any)=> d.totalReaches))-10)
          .attr('text-anchor', 'middle')
          .attr('fill', '#9DD696')
          .attr('font-size', '14px')
          .transition()
          .duration(1000)
          .delay(2660)
          .text((d: any) => d.totalReaches)
      }
}


export class NewsData{
  totalReaches: number;
  totalViews: number;
  date: string
}
