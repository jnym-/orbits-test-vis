<template>
    <div>
        <div id="potentialPlot" >
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import Plotly from 'plotly.js';

export default {
    name:'iv-eff-pot',
    props: {
        energies: {default: []},
        redraw: {default: true},
    },
    methods:{
        updatePlot(energies){
            console.log('updatePlot EffPot');
            this.energies = energies;
            this.redraw = true;
        }
    },
    mounted(){
        let vm = this;

        //let data2 = [[0, 0], [10, 10], [20, 40], [30, 90]];

        let minX = 0;
        let maxX = 100;
        let minY = -1;
        let maxY = 3;
        let plotWidth = 600;
        let plotHeight = 200;

        // let plotWidth = document.getElementById('potentialPlot').offsetWidth;
        // let plotHeight = document.getElementById('potentialPlot').offsetHeight;
        let axWidth = plotWidth * 0.8;
        let axHeight = plotHeight * 0.8;

        var xScaler = d3.scaleLinear()
                         .domain([minX, maxX])
                         .range([0, axWidth]);

        var yScaler = d3.scaleLinear()
                        .domain([minY, maxY])
                        .range([axHeight, 0])

        var plotSvg = d3.select("#potentialPlot")
                        .append("svg")
                        .attr("width", plotWidth)
                        .attr("height", plotHeight)


        // function rescale(minX, maxX, minY ,maxY) {
        //     xScaler.domain([minX, maxX])
        //     yScaler.domain([minY, maxY])
        //     plotSvg.select('.xaxis')
        //            .transition()
        //            .duration(1500)
        //            .call(d3.axisBottom().scale(xScaler))
        //     plotSvg.select('.yaxis')
        //            .transition()
        //            .duration(1500)
        //            .call(d3.axisLeft().scale(yScaler))
        //     plotSvg.select(".line")
        //            .transition().duration(1500)
        //            .attr("d", d3.line()
        //                     .x(function(d) { return xScaler(d[0]); })
        //                     .y(function(d) { return yScaler(d[1]); })
        //                     .curve(d3.curveMonotoneX)
        //             )
        // }
        

        // plotSvg.append("g")
        //        .attr("transform", "translate(50,10)")
        //        .attr("class", "yaxis")
        //        .call(d3.axisLeft().scale(yScaler));
        
        // plotSvg.append("g")
        //         .attr("transform", "translate(50, " + axHeight+10 + ")")
        //         .attr("class", "xaxis")
        //         .call(d3.axisBottom().scale(xScaler));

        // plotSvg.append("path")
        //        .data([data2])
        //        .attr("transform", "translate(50,10)")
        //        .attr("class", "line")
        //        .attr("stroke", "magenta")
        //        .attr("stroke-width", 2)
        //        .attr("fill", "none")
        //        .attr("d", d3.line()
        //                     .x(function(d) { return xScaler(d[0]); })
        //                     .y(function(d) { return yScaler(d[1]); })
        //                     .curve(d3.curveMonotoneX)
        //             )


        // plotSvg.append("circle")
        //        .data([data2[2]])
        //        .attr("transform", "translate(50,10)")
        //        .attr("cx", function(d) { return xScaler(d[0]); })
        //        .attr("cy", function(d) { return yScaler(d[1]); })
        //        .attr("r", 10)
        //        .attr("fill", "blue")
        //        .attr("stroke", "none")

        function redraw(){
            requestAnimationFrame(redraw);

            if(vm.redraw && vm.energies.length ){
                console.log('redrawing', vm.energies[4]);
                // plotSvg.selectAll("circle")
                //         .data([[50, 50]])
                //         .transition()
                //         .duration(10000)
                //         .attr("cx", function(d) { return xScaler(d[0]);})
                //         .attr("cy", function(d) { return yScaler(d[1]);})
                //         .ease(d3.easeLinear)

                let radialGravPot = [];
                let radialAngMom = [];
                let radialEffPot = [];
                for(let i = 0; i < vm.energies[2].length; i++){
                    radialGravPot.push([vm.energies[0][i], vm.energies[2][i]]);
                    radialAngMom.push([vm.energies[0][i], vm.energies[1][i]]);
                    radialEffPot.push([vm.energies[0][i], vm.energies[3][i]]);
                }

                let gravPot = {
                    x: vm.energies[0],
                    y: vm.energies[2],
                    type: 'lines',
                    name: 'Gravitational Potential',
                };

                let angMom = {
                    x: vm.energies[0],
                    y: vm.energies[1],
                    type: 'lines',
                    name: 'Angular Momentum',
                };
                
                let effPot = {
                    x: vm.energies[0],
                    y: vm.energies[3],
                    type: 'lines',
                    name: 'Effective Potential',
                }

                let data = [gravPot, angMom, effPot];

                Plotly.newPlot('potentialPlot', data);

                // let line1 = plotSvg.append("line")
                //                     .data([radialGravPot])
                //                     .enter()
                //                     .attr("class", "line")
                //                     .attr("stroke", "blue")
                //                     .attr("stroke-width", 2)
                //                     .attr("fill", "none")
                //                     .attr("d", d3.line()
                //                         .x(function(d) { return xScaler(d[0]); })
                //                         .y(function(d) { return yScaler(d[1]); })
                //                         .curve(d3.curveMonotoneX)
                //                     )

                

                // plotSvg.selectAll("path")
                //         .data([radialGravPot, radialAngMom, radialEffPot])
                //         .attr("transform", "translate(0,0)")
                //         .attr("class", "line")
                //         .attr("stroke", "blue")
                //         .attr("stroke-width", 2)
                //         .attr("fill", "none")
                //         .attr("d", d3.line()
                //                         .x(function(d) { return xScaler(d[0]); })
                //                         .y(function(d) { return yScaler(d[1]); })
                //                         .curve(d3.curveMonotoneX)
                //     )

                // plotSvg.append("path")
                //         .data([radialAngMom])
                //         .attr("transform", "translate(0,0)")
                //         .attr("class", "line")
                //         .attr("stroke", "orange")
                //         .attr("stroke-width", 2)
                //         .attr("fill", "none")
                //         .attr("d", d3.line()
                //                         .x(function(d) { return xScaler(d[0]); })
                //                         .y(function(d) { return yScaler(d[1]); })
                //                         .curve(d3.curveMonotoneX)
                //     )

                // plotSvg.append("path")
                //         .data([radialEffPot])
                //         .attr("transform", "translate(0,0)")
                //         .attr("class", "line")
                //         .attr("stroke", "Green")
                //         .attr("stroke-width", 3)
                //         .attr("fill", "none")
                //         .attr("d", d3.line()
                //                         .x(function(d) { return xScaler(d[0]); })
                //                         .y(function(d) { return yScaler(d[1]); })
                //                         .curve(d3.curveMonotoneX)
                //     )
                

                //rescale(0, Math.max(...vm.energies[0]), -0.5, 0.5);

                vm.redraw = false;
            }
        }

        redraw();


        // plotSvg.selectAll("circle")
        //        .data([[50, 20]])
        //        .enter()
        //        .append("circle")
        //        .attr("transform", "translate(50,10)")
        //        .attr("cx", function(d) { return xScaler(d[0]); })
        //        .attr("cy", function(d) { return yScaler(d[1]); })
        //        .attr("r", 10)
        //        .attr("fill", "blue")
        //        .attr("stroke", "none")

        // function rescale(maxX, maxY) {
        //     xScaler.domain([0, maxX])
        //     yScaler.domain([0, maxY])
        //     plotSvg.select('.xaxis')
        //            .transition()
        //            .duration(1500)
        //            .call(d3.axisBottom().scale(xScaler))
        //     plotSvg.select('.yaxis')
        //            .transition()
        //            .duration(1500)
        //            .call(d3.axisLeft().scale(yScaler))
        //     plotSvg.select(".line")
        //            .transition().duration(1500)
        //            .attr("d", d3.line()
        //                     .x(function(d) { return xScaler(d[0]); })
        //                     .y(function(d) { return yScaler(d[1]); })
        //                     .curve(d3.curveMonotoneX)
        //             )
        // }
        
        // setTimeout(rescale(90, 30), 10000);

    }
}
</script>

<style scoped>

</style>