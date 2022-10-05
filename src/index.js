import React from 'react';
import * as d3 from 'd3';
import './CSS/main.css';
import { svg } from 'd3';

/*
  Coded by @yunsuklee

  A project to apply D3 and AJAX in a React App.
  Fetching data from API in JSON format and getting to 
  display the data into a scatterplot chart using d3 library.

  I'll be commenting naively throughout the code to make it 
  easier for myself to understand how things are going.
*/

// Variables
const width = 850;
const height = 550;

// SVG 
let svgContainer = d3
  .select('.container-graph')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .sttr('class', 'container-graph--svg');

// Fetching
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then((data) => {
    // To know how to manipulate the data received
    console.log(JSON.stringify(data));

    svgContainer.append('text')
                .text("Time (min)")
                .attr('class', 'axis-title')
  })

