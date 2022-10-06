import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import './CSS/main.css';

/*
  Coded by @yunsuklee

  A project to apply D3 and AJAX in a React App.
  Fetching data from API in JSON format and getting to 
  display the data into a scatterplot chart using d3 library.
*/

// Variables
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
const width = 850 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;
const color = d3.scaleOrdinal(d3.schemeCategory10);
const timeFormat = d3.timeFormat('%M:%S');

// Define the div for the tooltip
let tooltip = d3
  .select('.container-graph')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

let svg = d3
  .select('.container-graph')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'container-graph--svg');

d3.json(url)
  .then(data => {
    data.forEach((item) => {
      item.Place = + item.Place;
      let parsedTime = item.Time.split(':');
      item.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    svg.append('text')
        .text('Time (min)')
        .attr('transform', 'rotate(-90)')
        .attr('x', -100)
        .attr('y', 44)
        .attr('class', 'axis-title');

    svg.append('text')
       .text('Year')
       .attr('x', 780)
       .attr('y', 520)
       .attr('class', 'axis-title');

    let xScale = d3
      .scaleLinear()
      .range([0, width - 100])
      .domain([
        d3.min(data, function (d) {
          return d.Year - 1;
        }),
        d3.max(data, function (d) {
          return d.Year + 1;
        })
      ]);
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    let yScale = d3
      .scaleTime()
      .range([0, height - 65])
      .domain(
        d3.extent(data, function (d) {
          return d.Time;
        })
      );
    let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg.append('g')
        .call(xAxis)  
        .attr('id', 'x-axis')
        .attr('transform', 'translate(100,' + (height - 30) + ')');

    svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(100, 35)');

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', function (d) {
        return xScale(d.Year);
      })
      .attr('cy', function (d) {
        return yScale(d.Time) - 115;
      })
      .attr('data-xvalue', function (d) {
        return d.Year;
      })
      .attr('data-yvalue', function (d) {
        return d.Time.toISOString();
      })
      .style('fill', function (d) {
        return color(d.Doping !== '');
      })
      .attr('transform', 'translate(100, 150)')
      .on('mouseover', (event, d) => {
        tooltip.transition()
               .duration(200)
               .style('opacity', 0.9);
        tooltip
          .attr('data-year', d.Year)
          .html(
            d.Name +
            ': ' +
            d.Nationality +
            '<br/>' +
            'Year: ' +
            d.Year +
            ', Time: ' +
            timeFormat(d.Time) +
            (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', (event.clientX / 2) + 'px')
          .style('top', (event.clientY - 100) + 'px')
      })
      .on('mouseout', () => {
        tooltip.transition()
               .duration(200)
               .style('opacity', 0);
      });
    
    let legendContainer = svg.append('g')
    .attr('id', 'legend');
    
    let legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (height / 2 - i * 20) + ')';
      });

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });

      legend
        .append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);
  })