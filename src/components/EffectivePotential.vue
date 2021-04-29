<template>
    <div>
        <div id="potentialPlot" style="height: 35vh">
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import Plotly from 'plotly.js';

export default {
    name:'iv-eff-pot',
    props: {
        pathVals: {default: []},
        redraw: {default: true},
        currentRadius: {default: 0},
    },
    methods:{
        updatePlot(pathVals){
            this.pathVals = pathVals;
            this.redraw = true;
        },
        updatePosition(pos){
            this.currentRadius = Math.pow(Math.pow(pos[0], 2) + Math.pow(pos[1], 2), 0.5);
        }
    },
    mounted(){
        let vm = this;
        const GravConst = 1;
        const sunMass = 100;

        let plotRadius = 200;

        //find energy of orbit
        function findE(){
            // E = Ueff + radial KE
            let rMag = Math.pow(Math.pow(vm.pathVals[0][0], 2) + Math.pow(vm.pathVals[0][1],2),0.5);
            //dot product of coordinates and velocity, divided by magnitude of radial position vector, to give magnitude of radial velocity
            let radialVMag = (vm.pathVals[0][0]*vm.pathVals[1][0] + vm.pathVals[0][1]*vm.pathVals[1][1])/rMag; //Math.pow(Math.pow(vm.pathVals[1][0], 2) + Math.pow(vm.pathVals[1][1],2),0.5);

            let E = effectivePotential(rMag) + 0.5*Math.pow(radialVMag,2);
            console.log('energy = ', E);
            return E
        };

        //r should be scalar
        function feltPotential(r){
            let vMag = Math.pow(Math.pow(vm.pathVals[1][0],2) + Math.pow(vm.pathVals[1][1],2), 0.5);
            let rMag = Math.pow(Math.pow(vm.pathVals[0][0],2) + Math.pow(vm.pathVals[0][1],2), 0.5); //Current position for constant L calculation
            let aMag = Math.pow(Math.pow(vm.pathVals[0][0] + vm.pathVals[1][0],2) + Math.pow(vm.pathVals[0][1] + vm.pathVals[1][1],2), 0.5);
            let theta = Math.acos((Math.pow(rMag,2) + Math.pow(vMag,2) - Math.pow(aMag,2))/(2*rMag*vMag));
            
            //console.log(vMag, rMag, aMag, theta);

            let L = vMag * rMag * Math.sin(theta);

            return Math.pow(L, 2)/(2*Math.pow(r, 2));
        };

        //r should be scalar
        function realPotential(r){
            return -GravConst*sunMass*(1/r);
        };

        //r should be scalar
        function effectivePotential(r){
            return feltPotential(r) + realPotential(r);
        };

        //finds min and max of potentials at minimum radius of orbit (for reasonable plotting)
        function findYRange(){
            let minR = vm.pathVals[3];
            let yMin = Math.min(realPotential(minR), feltPotential(minR));
            let yMax = Math.max(realPotential(minR), feltPotential(minR));
            return [yMin, yMax];
        }

        function redraw(){
            requestAnimationFrame(redraw);

            //update lines when 
            if(vm.redraw && plotRadius !== vm.pathVals[2]){
                
                let rVals = [];
                let Ueff = [];
                let U = [];
                let Ufelt = [];
                let EnergyY = [];
                let Energy = findE();
                
                plotRadius = vm.pathVals[2] + 50;
                let stepSize = plotRadius/200;

                for(let r = 0.1; r < plotRadius; r+= stepSize){
                    rVals.push(r);
                    Ueff.push(effectivePotential(r));
                    U.push(realPotential(r));
                    Ufelt.push(feltPotential(r));
                    EnergyY.push(Energy);
                };


                let trace1 = {
                x: rVals,
                y: Ueff,
                type: 'lines',
                name: 'Eff Pot',
                };

                let trace2 = {
                x: rVals,
                y: U,
                type: 'lines',
                name: 'Potential',
                };

                let trace3 = {
                x: rVals,
                y: Ufelt,
                type: 'lines',
                name: 'Ang Mom',
                };

                let totE = {
                x: rVals,
                y: EnergyY,
                name: 'Total Energy',
                line: {dash: 'dash', width: 1},
                };

                let data = [totE, trace1, trace2, trace3];

                Plotly.newPlot('potentialPlot', data, {
                xaxis: {range: [0, plotRadius],
                title: 'Radius',},
                yaxis: {range: findYRange()},
                margin: {
                    t: 10,
                    l: 20,
                    b: 50,
                },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                })


                vm.redraw = false;
            }

            let marker = {
                x:[vm.currentRadius],
                y:[effectivePotential(vm.currentRadius)],
                type:"markers",
                name:"Current Ueff",
                marker:{
                    color: "rgb(0,0,255)",
                    size: 10,
                }

            };

            Plotly.animate('potentialPlot',
                {data: [marker]},
                {
                    fromcurrent: true,
                    transition: {duration: 0},
                    frame: {duration: 0, redraw: false}
                }
            );
        }

        redraw();
    }
}
</script>

<style scoped>

</style>