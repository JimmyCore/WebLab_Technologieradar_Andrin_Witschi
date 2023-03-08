import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Technology } from '../Models/technology';
import { TechnologieService } from '../service/technologie.service';
import { RadarviewerNavigationService } from '../service/radarviewer-navigation.service';

class Dots {constructor(public x:any,public y:any,public text: string,public quadrant: number, public fillColor: string){}}

const COLOURS = {QUATRANT1: '#34ebde', QUATRANT2:'#b0eb28', QUATRANT3:'#c9148a', QUATRANT4:'#5611cf'}

@Component({
  selector: 'app-radar-viewer',
  templateUrl: './radar-viewer.component.html',
  styles: [
  ]
})

export class RadarViewerComponent implements OnInit {
  private arcGen: any;
  technologies;

  private x: any;
  private y: any;

  ngOnInit(): void {
    this.getTechnologies();
  }

  constructor(private techService: TechnologieService, private radarNav: RadarviewerNavigationService) {}

  getTechnologies(): void {
    this.techService.getPublicTechnologies().subscribe((res) => {
      this.technologies = res.msg;
      this.initCircles()
    })
  }

  private initCircles(): void {
    const vis = this

    const margin = {top: 110, right: 110, bottom: 110, left: 110},
    width = 960,
    height = 960

    const svgOuter = d3.select('#radar').append('svg')
        .attr('height', height)
        .attr('width', width)

    const domainwidth = width - margin.left - margin.right,
    domainheight = height - margin.top - margin.bottom,
    padding = 60

    const svgQuadrant = svgOuter.append('g')
        .attr("class", "quadrant-svg")

    const svg = svgOuter.append('g')
        .attr("class", "radar-svg")
        .style('transform', 'translate(' + margin.left + 'px, ' + margin.top + 'px)')

    this.x = d3.scaleLinear()
        .domain([-4, 4])
        .range([0, domainwidth]);
    this.y = d3.scaleLinear()
        .domain([-4, 4])
        .range([domainheight, 0]);

    const xAxis = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + this.y.range()[0] / 2 + ')');

    xAxis.call(d3.axisBottom(this.x).ticks(6))
        .call(g => g.selectAll('.tick text').remove())
        .call(g => g.selectAll('.tick line').remove())
        .call(g => g.selectAll('.domain').remove());

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + this.x.range()[1] / 2 + ', 0)')
        .call(d3.axisLeft(this.y).ticks(6))
        .call(g => g.selectAll('.tick text').remove())
        .call(g => g.selectAll('.tick line').remove())
        .call(g => g.selectAll('.domain').remove());

    vis.arcGen = (innerRadius:number, outerRadius:number, startAngle:number, endAngle:number) => d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);


    function innerFirstCircle (startAngle: number, endAngle: number) {
        return vis.arcGen(((domainheight) / 8) + 8, ((domainheight) / 8) - 8, startAngle, endAngle);
    };
    const innerSecondCircle = (startAngle: number, endAngle: number) => {
        return vis.arcGen(((domainheight) / 4) + 6, ((domainheight) / 4) - 6, startAngle, endAngle);
    };
    const innerThirdCircle = (startAngle: number, endAngle: number) => {
        return vis.arcGen(((domainheight) / 8 * 3) + 4, ((domainheight) / 8 * 3) - 4, startAngle, endAngle);
    };
    function innerFourthCircle (startAngle: number, endAngle: number) {
        return vis.arcGen(((domainheight) / 2) + 2, ((domainheight) / 2) - 2, startAngle, endAngle);
    };

    const circleTransform = 'translate(' + (domainwidth / 2) + 'px, ' + (domainheight / 2) + 'px)';

    const TECHNIQUES = COLOURS.QUATRANT1;
    const techniques = svg.append('g')
        .attr('class', 'technique')
        .on('mouseenter', () => this.mouseEnterQuadrant(1))
        .on('mouseleave', () => this.mouseLeaveQuadrant(1));

    techniques.append("text")
        .attr("x", domainwidth / 2 - ((domainheight) / 2) + 25)
        .attr("y", domainheight/2)
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "14px")
        .text("Hold")

    techniques.append("text")
        .attr("x", domainwidth / 2 - ((domainheight) / 4) + 25)
        .attr("y", domainheight/2)
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "14px")
        .text("Assess")

    techniques.append("text")
        .attr("x", domainwidth / 2 - ((domainheight) / 8 * 3) + 25)
        .attr("y", domainheight/2)
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "14px")
        .text("Trial")

    techniques.append("text")
        .attr("x", domainwidth / 2 - ((domainheight) / 8) + 25)
        .attr("y", domainheight/2)
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "14px")
        .text("Adopt")

    // green circle borders
    techniques.append('path')
        .attr('fill', TECHNIQUES)
        .attr('d', innerFirstCircle(3 * Math.PI / 2, 4 * Math.PI / 2))
        .style('transform', circleTransform);

    techniques.append('path')
        .attr('fill', TECHNIQUES)
        .attr('d', innerSecondCircle(3 * Math.PI / 2, 4 * Math.PI / 2))
        .style('transform', circleTransform);
    techniques.append('path')
        .attr('fill', TECHNIQUES)
        .attr('d', innerThirdCircle(3 * Math.PI / 2, 4 * Math.PI / 2))
        .style('transform', circleTransform);
    techniques.append('path')
        .attr('fill', TECHNIQUES)
        .attr('d', innerFourthCircle(3 * Math.PI / 2, 4 * Math.PI / 2))
        .style('transform', circleTransform);

    svgQuadrant.append('rect')
        .attr('id', 'quadrant-1')
        .attr('width', (width-padding) / 2)
        .attr('height', (height-padding) / 2)
        .attr('x', padding/2)
        .attr('y', padding/2)
        .attr('fill', TECHNIQUES)
        .style('opacity', 0.01)
        .on('mouseenter', () => this.mouseEnterQuadrant(1))
        .on('mouseleave', () => this.mouseLeaveQuadrant(1))
        .on('click', () => this.radarNav.OnNavigateQuadrant(1));

    svgQuadrant.append("text")
        .attr("x", (padding / 2) + 30)
        .attr("y", padding)
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "25px")
        .text("Techniques")
        .on('mouseenter', () => this.mouseEnterQuadrant(1))
        .on('mouseleave', () => this.mouseLeaveQuadrant(1));

    const TOOLS = COLOURS.QUATRANT2
    const tools = svg.append('g')
        .attr('class', 'tool')
        .on('mouseenter', () => this.mouseEnterQuadrant(2))
        .on('mouseleave', () => this.mouseLeaveQuadrant(2));

     // green circle borders
    tools.append('path')
        .attr('fill', TOOLS)
        .attr('d', innerFirstCircle(-3 * Math.PI / 2, -4 * Math.PI / 2))
        .style('transform', circleTransform);
    tools.append('path')
        .attr('fill', TOOLS)
        .attr('d', innerSecondCircle(-3 * Math.PI / 2, -4 * Math.PI / 2))
        .style('transform', circleTransform);
    tools.append('path')
        .attr('fill', TOOLS)
        .attr('d', innerThirdCircle(-3 * Math.PI / 2, -4 * Math.PI / 2))
        .style('transform', circleTransform);
    tools.append('path')
        .attr('fill', TOOLS)
        .attr('d', innerFourthCircle(-3 * Math.PI / 2, -4 * Math.PI / 2))
        .style('transform', circleTransform);

    svgQuadrant.append('rect')
        .attr('id', 'quadrant-2')
        .attr('width', (width - padding) / 2)
        .attr('height', (height - padding) / 2)
        .attr('x', width / 2)
        .attr('y', padding/2)
        .attr('fill', TOOLS)
        .style('opacity', 0.01)
        .on('mouseenter', () => this.mouseEnterQuadrant(2))
        .on('mouseleave', () => this.mouseLeaveQuadrant(2))
        .on('click', () => this.radarNav.OnNavigateQuadrant(2));

    svgQuadrant.append("text")
      .attr("x", (width - padding * 2))
      .attr("y", padding)
      .attr("dy", ".35em")
      .attr('fill', 'white')
      .style("font-size", "25px")
      .text("Tools")
      .on('mouseenter', () => this.mouseEnterQuadrant(2))
      .on('mouseleave', () => this.mouseLeaveQuadrant(2));

    const FRAMEWORKS = COLOURS.QUATRANT3
    const frameworks = svg.append('g')
        .attr('class', 'framework')
        .on('mouseenter', () => this.mouseEnterQuadrant(3))
        .on('mouseleave', () => this.mouseLeaveQuadrant(3));

     // green circle borders
    frameworks.append('path')
        .attr('fill', FRAMEWORKS)
        .attr('d', innerFirstCircle(1 * Math.PI / 2, 2 * Math.PI / 2))
        .style('transform', circleTransform)
    frameworks.append('path')
        .attr('fill', FRAMEWORKS)
        .attr('d', innerSecondCircle(1 * Math.PI / 2, 2 * Math.PI / 2))
        .style('transform', circleTransform);
    frameworks.append('path')
        .attr('fill', FRAMEWORKS)
        .attr('d', innerThirdCircle(1 * Math.PI / 2, 2 * Math.PI / 2))
        .style('transform', circleTransform);
    frameworks.append('path')
        .attr('fill', FRAMEWORKS)
        .attr('d', innerFourthCircle(1 * Math.PI / 2, 2 * Math.PI / 2))
        .style('transform', circleTransform);

    svgQuadrant.append('rect')
        .attr('id', 'quadrant-3')
        .attr('width', (width - padding) / 2)
        .attr('height', (height - padding) / 2)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('fill', FRAMEWORKS)
        .style('opacity', 0.025)
        .on('mouseenter', () => this.mouseEnterQuadrant(3))
        .on('mouseleave', () => this.mouseLeaveQuadrant(3))
        .on('click', () => this.radarNav.OnNavigateQuadrant(3));


    svgQuadrant.append("text")
        .attr("x", (width - padding * 2) - padding - 35)
        .attr("y", (height - padding - 30))
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "25px")
        .text("Languages &")
        .on('mouseenter', () => this.mouseEnterQuadrant(3))
        .on('mouseleave', () => this.mouseLeaveQuadrant(3));
    svgQuadrant.append("text")
        .attr("x", (width - padding * 2) - padding - 35)
        .attr("y", (height - padding))
        .attr("dy", ".35em")
        .attr('fill', 'white')
        .style("font-size", "25px")
        .text("Frameworks")
        .on('mouseenter', () => this.mouseEnterQuadrant(3))
        .on('mouseleave', () => this.mouseLeaveQuadrant(3));



    const PLATFORMS = COLOURS.QUATRANT4
    const platforms = svg.append('g')
          .attr('class', 'platform');

      // green circle borders
    platforms.append('path')
      .attr('fill', PLATFORMS)
      .attr('d', innerFirstCircle(-Math.PI, -Math.PI / 2))
      .style('transform', circleTransform)

    platforms.append('path')
      .attr('fill', PLATFORMS)
      .attr('d', innerSecondCircle(-Math.PI, -Math.PI / 2))
      .style('transform', circleTransform)

    platforms.append('path')
      .attr('fill', PLATFORMS)
      .attr('d', innerThirdCircle(-Math.PI, -Math.PI / 2))
      .style('transform', circleTransform);

    platforms.append('path')
      .attr('fill', PLATFORMS)
      .attr('d', innerFourthCircle(-Math.PI, -Math.PI / 2))
      .style('transform', circleTransform)

    svgQuadrant.append('rect')
      .attr('id', 'quadrant-4')
      .attr('width', (width - padding) / 2)
      .attr('height', (height - padding) / 2)
      .attr('x', padding/2)
      .attr('y', height/2)
      .attr('fill', PLATFORMS)
      .style('opacity', .02)
      .on('mouseenter', () => this.mouseEnterQuadrant(4))
      .on('mouseleave', () => this.mouseLeaveQuadrant(4))
      .on('click', () => this.radarNav.OnNavigateQuadrant(4));

    svgQuadrant.append("text")
      .attr("x", padding)
      .attr("y", (height - padding))
      .attr("dy", ".35em")
      .attr('fill', 'white')
      .style("font-size", "25px")
      .text("Platforms")
      .on('mouseenter', () => this.mouseEnterQuadrant(4))
      .on('mouseleave', () => this.mouseLeaveQuadrant(4))
      .on('click', () => this.radarNav.OnNavigateQuadrant(4));

    this.updateDots();

  }

  private getDots(list: Technology[], xScale:d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): Dots[] {
    var updatedList: Dots[] = [];
    list.forEach(element => {
      const entry: Dots = {
        x: null,
        y: null,
        text: element.name,
        quadrant: this.getQuadrantByCategory(element.category),
        fillColor: [COLOURS.QUATRANT1, COLOURS.QUATRANT2, COLOURS.QUATRANT3, COLOURS.QUATRANT4][this.getQuadrantByCategory(element.category) - 1],
      };

      let dot: any;
      do {
          dot = this.calculateDot(element, xScale, yScale);
          if(updatedList.length <= 0){break;}
          // calculate this exact dot new until it has a distance to every other dot that is longer than 28 (2x dot radius)
      } while (updatedList.some(item => this.checkDistanceBetweenDots(dot.xValue, item.x, dot.yValue, item.y) < 20));

      entry.x = dot.xValue;
      entry.y = dot.yValue;
      updatedList.push(entry);
    });

    return updatedList;
  };

  private mouseEnterQuadrant(quadrant: number) {
    d3.select("#quadrant-" + quadrant).style("opacity", 0.1)
    d3.selectAll('.radar-svg').style("cursor", "pointer")
    d3.selectAll('.quadrant-svg').style("cursor", "pointer")

  }

  private mouseLeaveQuadrant(quadrant: number) {
    d3.select("#quadrant-" + quadrant).style("opacity", 0.01)
  }

 updateDots() {
    var dots: Dots[] = this.getDots(this.technologies, this.x, this.y);
    this.drawDots(dots)
  }

  drawDots(technologies: Dots[]) {
    var svg = d3.selectAll(".radar-svg")
    svg.append('g')
      .attr('class', 'circles')
      .selectAll('circle')
      .data(technologies)
      .enter()
      .append('circle')
      .attr('class', d => 'dot is-' + d.fillColor)
      .attr('r', 5)
      .attr('data-value', d => d.text)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .style('fill', d => d.fillColor)

    svg.append('g')
      .attr('class', 'circles')
      .selectAll('circle')
      .data(technologies)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y - 15)
      .attr("dx", function(d) {return -20})
      .text(d => d.text)
      .style('fill', 'white')
      .style("font-size", "10px")
  }

  checkDistanceBetweenDots (x1: number, x2: number, y1: number, y2: number) {
    const a = x2 - x1;
    const b = y2 - y1;
    return Math.sqrt((a * a) + (b * b));
  };

  calculateDot (element: Technology, x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>) {
    const pi = Math.PI;
    // radian between 5 and 85
    const randomDegree = ((Math.random() * 80 + 5) * pi) / 180;
    const circle = this.getCircleByMaturity(element.ring) - 0.2;
    const r = Math.random() * 0.6 + (circle - 0.6);
    // multiples of PI/2
    // loops through every quadrant starting from top left, bottom left, bottom right, top right
    const shift = pi * [1,4,3,2][this.getQuadrantByCategory(element.category) - 1] / 2;

    return {
        xValue: x(Math.cos(randomDegree + shift) * r),
        yValue: y(Math.sin(randomDegree + shift) * r)
    };
  };

  getQuadrantByCategory(category: string): number {
    switch (category) {
      case("Techniques"):
        return 1;
      case("Tools"):
        return 2;
      case("Languages & Frameworks"):
        return 3;
      case("Platforms"):
        return 4;
      default:
        return 0;
    }
  }

  getCircleByMaturity(maturity: string): number {
    switch (maturity) {
        case("Adopt"):
          return 1;
        case("Trial"):
          return 2;
        case("Assess"):
          return 3;
        case("Hold"):
          return 4;
        default:
          return 0;
    }
  }
}
