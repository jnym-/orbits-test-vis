<template>
  <div id="app" style="overflow: hidden;">
    <iv-title-bar>Orbits</iv-title-bar>
    <iv-visualisation>
      <template #hotspots>
        <iv-pane position="left" format="push" width=500 style="overflow: scroll;">
            <hr style="margin-top: 0" >
            <h2 class="main-text">Orbit Energy Regimes</h2>
            <hr>
            <p class="main-text">
              The total energy of a gravitational orbit is the sum of the kinetic energy and the gravitational potential energy of the orbiting body. In polar coordinates, kinetic energy can be broken down into radial and angular components, as shown. 
            </p>
            <iv-equation-box equation="T = \frac{m}{2} (\dot{r} \hat{r} + v_\phi \hat{\phi} )^2  " class="main-text"/>
            <p class="main-text">Since <iv-equation-box :stylise="false" equation="L=m  r v_\phi" /> the total energy can be written as: 
            <iv-equation-box equation="E= \frac{1}{2} m \dot{r}^2 + \frac{L^2}{2 m r^2} - \frac{GmM}{r} " class="main-text"/> </p>
            
            <p class="main-text">
              As a result of the conservation of energy, the total energy is constant. The last two terms are often referred to as the “effective potential”, as this is the potential that the body itself experiences in the rotating frame. The term with the angular momentum is the virtual “centrifugal” potential, and the last term is the gravitational potential.            </p>
            <p class="main-text">
              If the total energy is greater than zero, then the object will not be in a bound orbit, and so will not follow a closed path, while for negative energies the orbit will be bound. If the object has no radial kinetic energy, then it will lie at the minimum of the effective potential with a fixed radius: this is a circular orbit. However, suppose the object has some radial kinetic energy, but still has an energy less than zero. In that case, it will oscillate within the potential well, between a minimum and a maximum radius: this corresponds to an elliptical orbit. An orbit with a total energy of exactly zero will have a parabolic path since <iv-equation-box :stylise="false" equation="\lim_{r \to \infty} \dot{r} = 0" />, and an orbit with an energy greater than zero corresponds to a hyperbolic path since: <iv-equation-box :stylise="false" equation="\lim_{r \to \infty} \dot{r} > 0" /></p>
            </p>

            <br>
            <hr>
            <h2 class="main-text">Velocity Boosts</h2>
            <hr>
            
            <p class="main-text">Gravity only acts radially, so without the influence of any other forces, angular momentum is conserved. If the object can give itself a tangential velocity boost (e.g., with a rocket engine), then it will be able to change its angular momentum and therefore change the shape of its orbit. We can predict how the orbit will change under tangential boosts by considering the effective potential.  </p>
            <p class="main-text">With a tangential boost, the gravitational potential part will remain unchanged; however, the centrifugal term will increase or decrease depending on whether the boost was with or against the object’s existing velocity. </p>
            <p class="main-text">If the centrifugal term increases, then the minimum of the effective potential will increase and move to the right of the plot, thus increasing the radius of the rest of the orbit. With a velocity boost opposing the initial velocity, then the minimum of the effective potential plot will become deeper and move to the left of the plot, this corresponds to the radius of the rest of the orbit decreasing. </p>
        
        </iv-pane>
        <!-- <iv-toggle-hotspot id="iv-toggle-hotspot-bottomleft" position="bottomleft" title="BOTTOM LEFT"></iv-toggle-hotspot> -->
        <!-- <iv-toggle-hotspot id="iv-toggle-hotspot-topleft" position="topleft" title="TOP LEFT"></iv-toggle-hotspot> -->
"
        <iv-toggle-hotspot id="iv-fixed-hotspot-bottom" position="bottom" title="Effective Potential">
            <EffPot ref="effPlot" />
        </iv-toggle-hotspot>
        <iv-fixed-hotspot id="iv-fixed-hotspot-topleft" position="topleft" title="Guidance" style="height: 0%">
          <p style="padding: 1rem; background-color: sky blue;">Click on the blue dot to change the orbit, or touch and drag on touchscreen.</p>
        </iv-fixed-hotspot>
        <iv-fixed-hotspot id="iv-fixed-hotspot-topright" position="topright" title="PlayackControls" style="height: 40%;" transparent=true>
          <label style="padding-top: 3%">Playback Speed</label>
          <iv-slider style="padding-top: 5%; height: 5vh;" min=0 max=50 step=1 @sliderChanged="playSpeed" init_val=1></iv-slider>
          <!-- <iv-button>Reset Orbit</iv-button> -->
        </iv-fixed-hotspot>
        <!-- <iv-fixed-hotspot id="iv-fixed-hotspot-right" position="right" title="RIGHT"></iv-fixed-hotspot> -->
        
      </template>

      <Orbits @path-update="updatePlot" @position-update="updatePosition" @onresize="updateSize" v-bind:animationSpeed="animationSpeed"/>

    </iv-visualisation>
    <!-- <iv-guidance-system :guidance_branches_input="guidance_branch_list" /> -->
  </div>
</template>

<script>
import Orbits from './components/Orbits.vue'; 
import EffPot from './components/EffectivePotential.vue';
//<iv-pane position="left" />
//
//
export default {
  name:"App",
  title: "Orbits - ImpVis",
  components:{
    Orbits,
    EffPot
  },
  methods:{
    updatePlot(energies){
      //Pass through event to effPlot
      this.$refs.effPlot.updatePlot(energies);     
    },
    updatePosition(pos){
      //Pass through event to effPlot
      this.$refs.effPlot.updatePosition(pos);
    },
    updateSize(){
      console.log('resize');
    },
    playSpeed(e){
      this.animationSpeed = e;
    }
  },
  props:{
    animationSpeed: {
      default: 1
    },
  }
}
</script>

<style>
.iv-equation-box{
    display:inline-block;
}
.main-text{
  margin-left: 0.3rem;
}

</style>
 
