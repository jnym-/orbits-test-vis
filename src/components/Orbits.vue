<template>
    <div id="parent" style="height:100%;" @mousemove="mouseOver" @mouseleave="mouseLeave" @mousedown="activateSelect" @mouseup="cancelSelect" @touchstart="touchOn" @touchend="touchOff" @touchmove="touchChange">
         <canvas id="canvas" style="width:100%; height:100%" ></canvas>
    </div>
</template>

<script>
export default {
    name: 'iv-orbits',
    props: {
        mouse: {
            default: {
                x: undefined,
                y: undefined
            }
        },
        animationSpeed: {
            default: 1
        },
        velocitySelect: {
            default: false
        },
        sunRadius: {
            default: 20
        },
        touchSelect: {
            default: false
        },
        initialTouchPos:{
            default: {
                x: undefined,
                y: undefined
            }
        },
        currentTouchPos:{
            default: {
                x: undefined,
                y: undefined
            }
        },
    },
    methods: {
        touchOn(event){
            this.initialTouchPos.x = event.touches[0].pageX;
            this.initialTouchPos.y = event.touches[0].pageY;
            //console.log('touchOn');
        },
        touchOff(){
            this.touchSelect = false;
            this.currentTouchPos.x = undefined;
            this.currentTouchPos.y = undefined;
            this.initialTouchPos.x = undefined;
            this.initialTouchPos.y = undefined;
            //console.log('touchOff');
        },
        touchChange(event){
            this.touchSelect = true;
            this.currentTouchPos.x = event.touches[0].pageX;
            this.currentTouchPos.y = event.touches[0].pageY;
        },
        mouseOver(event){
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        },
        mouseLeave(){
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        },
        activateSelect(){
            this.velocitySelect = true;
        },
        cancelSelect(){
            this.velocitySelect = false;
        },
    },
    mounted(){
        let vm = this;
        let canvas = document.querySelector('canvas');
        let parent = document.getElementById('parent');
        let rect = parent.getBoundingClientRect();
        let mouseX = null;
        let mouseY = null;
        let currentTouchX = null;
        let currentTouchY = null;
        let c = canvas.getContext('2d');
        let scale = 1;


        function resize(){
            canvas = document.querySelector('canvas');
            parent = document.getElementById('parent');
            rect = parent.getBoundingClientRect();
            
            canvas.width = parent.offsetWidth*(1/scale);
            canvas.height = parent.offsetHeight*(1/scale);
            
            //centre about x=0, y=0
            c.translate(canvas.width/2, canvas.height/2);
            
            setTimeout(resize, 100);
        }

        resize();
        setTimeout(resize, 100);
         
         

        // let initialTouchX = this.initialTouchPos.x - rect.left;
        // let initialTouchY = this.initialTouchPos.y - rect.top;
        //windowResize();



        function rotateShape(angle, centre, points){
            //console.log(angle, centre, points);
            for(let i = 0; i < points.length; i++){
                points[i] = [points[i][0]*Math.cos(angle) - points[i][1]*Math.sin(angle), points[i][0]*Math.sin(angle) + points[i][1]*Math.cos(angle)];
                points[i][0] = centre[0] + points[i][0];
                points[i][1] = centre[1] + points[i][1];
            }
            return points;
        }

        
        function Ball(x, y, defaultRadius, dx, dy) {
            this.x = x;
            this.y = y;
            this.radius = defaultRadius;
            this.pathIndex = 0;
            this.velocitySelect = false;
            this.touchInterface = false;
            this.timeSinceClick = 10;
            this.buttonStep = 0.1;
            this.arrowConfirmed = false;
            let newPath = false;

            if(dx == undefined || dy == undefined){
                //make all orbit in circular orbits in same direction initially 
                this.dx = 0;
                this.dy = 0;

                for(let i = 0; i < massCentres.length; i++){  
                    this.dist = Math.pow(Math.pow(this.x-massCentres[i][0] , 2) + Math.pow(this.y-massCentres[i][1], 2), 0.5);
                    this.dy += -initialVel*massCentres[i][2]*Math.abs(Math.pow(this.dist , -2))*(massCentres[i][0]-this.x);
                }
                for(let i = 0; i < massCentres.length; i++){
                    this.dist = Math.pow(Math.pow(this.x-massCentres[i][0] , 2) + Math.pow(this.y-massCentres[i][1], 2), 0.5);
                    //this.dx += initialVel*massCentres[i][2]*Math.abs(Math.pow(this.dist , -2))*(massCentres[i][1]-this.y);
                }
            } else {
                this.dx = dx;
                this.dy = dy;
            }

            this.path = function(dx, dy)  {
                let currentPos = [this.x, this.y];
                let currentVel = [this.dx, this.dy];
                console.log(this.velocitySelect);
                if(this.velocitySelect || newPath){
                    if(isNaN(dx) || isNaN(dy)){
                        currentVel = [this.x, this.y];
                    } else {
                        currentVel = [dx, dy];
                    }
                } else {      
                    this.pathVels = [];
                    this.pathCoords = [];
                    this.scale = 1;
                }
                let iterations = 0;
                this.newCoords = [];
                this.newVels = [];
                let stepSize = 1;
                this.closedPath = true;
                let reverseMultiplier = 1;
                this.maxIterations = 20000;
                console.log('path drawing');

                while(Math.pow((Math.pow(this.x-currentPos[0], 2) + Math.pow(this.y-currentPos[1],2)),0.5) > 1 || iterations < 100){

                    currentPos[0] += currentVel[0] * reverseMultiplier * stepSize;
                    currentPos[1] += currentVel[1] * reverseMultiplier * stepSize;

                    for(let i = 0; i < massCentres.length; i++){
                        let dist = Math.pow(Math.pow(currentPos[0]-massCentres[i][0] , 2) + Math.pow(currentPos[1]-massCentres[i][1], 2), 0.5);

                        currentVel[0] = currentVel[0] + reverseMultiplier * massCentres[i][2]*Math.abs(Math.pow(dist , -3))*(massCentres[i][0]-currentPos[0]);
                        currentVel[1] = currentVel[1] + reverseMultiplier * massCentres[i][2]*Math.abs(Math.pow(dist , -3))*(massCentres[i][1]-currentPos[1]);
                    }

                    if (this.closedPath){
                        if(this.velocitySelect || newPath){
                            this.newCoords.push(currentPos.slice());
                            this.newVels.push(currentVel.slice());
                        } else{
                            this.pathCoords.push(currentPos.slice());
                            this.pathVels.push(currentVel.slice());
                        }
                    } else{
                        if(this.velocitySelect || newPath){
                            this.newCoords.unshift(currentPos.slice());
                            this.newVels.unshift(currentVel.slice());
                        } else{
                            this.pathCoords.unshift(currentPos.slice());
                            this.pathVels.unshift(currentVel.slice());
                        }
                    }

                    iterations += 1;
                    
                    //Draw reverse path for open path
                    if(iterations > this.maxIterations || Math.pow(Math.pow(currentPos[0],2) + Math.pow(currentPos[1],2),0.5) < vm.sunRadius){
                        this.maxIterations = iterations;
                        this.closedPath = false;
                        if(this.velocitySelect || newPath){
                            currentPos = [this.x, this.y];
                            currentVel = [dx, dy];
                        } else {
                            currentPos = [this.x, this.y];
                            currentVel = [this.dx, this.dy];
                        }
                        iterations = 0;
                        
                        if(reverseMultiplier < 0){
                            break;
                        }

                        reverseMultiplier = -1;
                        console.log('reverse');
                    }

                }

                
                
                //Call scaling method
                for(let i = 0; i < 5; i++){  
                    this.scaleCanvas();
                }
                resize();
                
                newPath = false;


                //Find max radius of path
                let maxRadius = 0;
                let minRadius = 10000000;
                
                if(this.newCoords.length > 0){
                    for(let i = 0; i <this.newCoords.length; i++){
                        let dist = Math.pow(Math.pow(this.newCoords[i][0],2)+Math.pow(this.newCoords[i][1],2),0.5);
                        if(dist > maxRadius){
                            maxRadius = dist;
                        }
                        if(dist < minRadius){
                            minRadius = dist;
                        }
                    }
                } else {
                    for(let i = 0; i <this.pathCoords.length; i++){
                        let dist = Math.pow(Math.pow(this.pathCoords[i][0],2)+Math.pow(this.pathCoords[i][1],2),0.5);
                        if(dist > maxRadius){
                            maxRadius = dist;
                        }
                        if(dist < minRadius){
                            minRadius = dist;
                        }
                    }
                }
            
                vm.$emit('path-update', [currentPos, currentVel, maxRadius, minRadius]);
            }

            this.scaleCanvas = function() {
                // Scaling
                let maxX = this.pathCoords[0][0];
                let maxY = this.pathCoords[0][1];
                let minX = this.pathCoords[0][0];
                let minY = this.pathCoords[0][1];

                if(this.newCoords.length > 0){
                    maxX = this.newCoords[0][0];
                    maxY = this.newCoords[0][1];
                    minX = this.newCoords[0][0];
                    minY = this.newCoords[0][1];

                    for (let i = 0; i < this.newCoords.length; i++) {
                        let coord = this.newCoords[i]

                        if (coord[0] > maxX) {
                            maxX = coord[0];
                        }
                        else if (coord[0] < minX) {
                            minX = coord[0];
                        }

                        if (coord[1] > maxY) {
                            maxY = coord[1];
                        }
                        else if (coord[1] < minY) {
                            minY = coord[1];
                        }
                    }
                } else{
                    maxX = this.pathCoords[0][0];
                    maxY = this.pathCoords[0][1];
                    minX = this.pathCoords[0][0];
                    minY = this.pathCoords[0][1];

                    for (let i = 0; i < this.pathCoords.length; i++) {
                        let coord = this.pathCoords[i]

                        if (coord[0] > maxX) {
                            maxX = coord[0];
                        }
                        else if (coord[0] < minX) {
                            minX = coord[0];
                        }

                        if (coord[1] > maxY) {
                            maxY = coord[1];
                        }
                        else if (coord[1] < minY) {
                            minY = coord[1];
                        }
                    }
                }

                if(maxX < canvas.width*(1/this.scale)/4 && maxY < canvas.height*(1/this.scale)/4 && minX > -canvas.width*(1/this.scale)/4 && minY > -canvas.height*(1/this.scale)/4){
                    //console.log('downsize', maxX, minX, canvas.width*(1/this.scale)/4, maxY, minY, canvas.height*(1/this.scale)/4);
                    //unscale
                    c.scale((1/this.scale), (1/this.scale));
                    // c.translate(canvas.width/4, canvas.height/4);
                    this.scale = this.scale*2;
                    //c.scale(this.scale, this.scale); rescale done by resize()
                }else if(maxX > canvas.width*(1/this.scale)/2 || maxY > canvas.height*(1/this.scale)/2 || minX < -canvas.width*(1/this.scale)/2 || minY < -canvas.height*(1/this.scale)/2){
                    //console.log('upsize', maxX, minX, canvas.width*(1/this.scale)/4, maxY, minY, canvas.height*(1/this.scale)/4);
                    //unscale
                    c.scale((1/this.scale), (1/this.scale));
                    // c.translate(canvas.width/4, canvas.height/4);
                    this.scale = this.scale/2;
                    //c.scale(this.scale, this.scale); rescale done by resize()
                }
                
                scale = this.scale;
                resize();
            }

            this.draw = function() {
                this.radius = defaultRadius*(1/this.scale);
                let arrowOffset = this.radius*3;

                c.beginPath();
                c.moveTo(this.pathCoords[0][0], this.pathCoords[0][1]);
                for(let i = 1; i < this.pathCoords.length; i++){
                    c.lineTo(this.pathCoords[i][0], this.pathCoords[i][1]);
                }
                if(this.closedPath){
                    c.lineTo(this.pathCoords[0][0], this.pathCoords[0][1]);
                }
                c.lineWidth = 2*(1/this.scale);
                c.strokeStyle = "black";
                c.stroke();

                if(this.velocitySelect && this.newCoords.length > 0){
                    c.beginPath();
                    c.moveTo(this.newCoords[0][0], this.newCoords[0][1]);
                    for(let i = 1; i < this.newCoords.length; i++){
                        c.lineTo(this.newCoords[i][0], this.newCoords[i][1]);
                    }
                    if(this.closedPath){
                        c.lineTo(this.newCoords[0][0], this.newCoords[0][1]);
                    }
                    c.lineWidth = 2*(1/this.scale);
                    c.strokeStyle = "blue";
                    c.stroke();
                }

                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
                c.fillStyle = 'rgb(0,0,255)';
                c.fill();
                
                if(this.velocitySelect){
                    c.beginPath();
                    c.arc(this.x, this.y, this.radius*1.5, 0, 2*Math.PI);
                    c.fillStyle = 'rgb(0,255,0)';
                    c.fill();

                    this.tanAngle = Math.atan2(this.pathCoords[this.pathIndex+1][1]- this.pathCoords[this.pathIndex-1][1], this.pathCoords[this.pathIndex+1][0]- this.pathCoords[this.pathIndex-1][0]);

                    this.arrowCentres = [];
                    for(let i = 0; i < 4; i++){
                        this.arrowCentres.push([this.x + this.radius*4*Math.cos(this.tanAngle + i*Math.PI/2), this.y + this.radius*4*Math.sin(this.tanAngle + i*Math.PI/2)]);
                    }

                    this.tanPoints1 = rotateShape(this.tanAngle, [this.x, this.y], [[arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius*2], [this.radius*3+arrowOffset, 0],
                    [this.radius*2+arrowOffset, -this.radius*2], [this.radius*2+arrowOffset, -this.radius], [arrowOffset, -this.radius]]);
                    this.tanPoints2 = rotateShape(this.tanAngle + Math.PI, [this.x, this.y], [[arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius*2], [this.radius*3+arrowOffset, 0],
                    [this.radius*2+arrowOffset, -this.radius*2], [this.radius*2+arrowOffset, -this.radius], [arrowOffset, -this.radius]]);
                    this.rotPoints1 = rotateShape(this.tanAngle + Math.PI/2, [this.x, this.y], [[arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius*2], [this.radius*3+arrowOffset, 0],
                    [this.radius*2+arrowOffset, -this.radius*2], [this.radius*2+arrowOffset, -this.radius], [arrowOffset, -this.radius]]);
                    this.rotPoints2 = rotateShape(this.tanAngle + 3*Math.PI/2, [this.x, this.y], [[arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius], [this.radius*2+arrowOffset, this.radius*2], [this.radius*3+arrowOffset, 0],
                    [this.radius*2+arrowOffset, -this.radius*2], [this.radius*2+arrowOffset, -this.radius], [arrowOffset, -this.radius]]);

                    c.beginPath();
                    c.moveTo(this.tanPoints1[0][0], this.tanPoints1[0][1]);
                    for(let i = 1; i < this.tanPoints1.length; i++){
                        c.lineTo(this.tanPoints1[i][0], this.tanPoints1[i][1]);
                    }
                    c.fillStyle = 'blue';
                    c.fill();

                    c.beginPath();
                    c.moveTo(this.tanPoints2[0][0], this.tanPoints2[0][1]);
                    for(let i = 1; i < this.tanPoints2.length; i++){
                        c.lineTo(this.tanPoints2[i][0], this.tanPoints2[i][1]);
                    }
                    c.fillStyle = 'blue';
                    c.fill();


                    c.beginPath();
                    c.moveTo(this.rotPoints1[0][0], this.rotPoints1[0][1]);
                    for(let i = 1; i < this.rotPoints1.length; i++){
                        c.lineTo(this.rotPoints1[i][0], this.rotPoints1[i][1]);
                    }
                    c.fillStyle = 'purple';
                    c.fill();

                    c.beginPath();
                    c.moveTo(this.rotPoints2[0][0], this.rotPoints2[0][1]);
                    for(let i = 1; i < this.rotPoints2.length; i++){
                        c.lineTo(this.rotPoints2[i][0], this.rotPoints2[i][1]);
                    }
                    c.fillStyle = 'purple';
                    c.fill();
                }

                if(vm.touchSelect){
                    // let dispX = currentTouchX - initialTouchX;
                    // let dispY = currentTouchY - initialTouchY;
                    this.mag = Math.pow(Math.pow(currentTouchX- this.x, 2) + Math.pow(currentTouchY-this.y, 2), 0.5);
                    if(this.mag > this.radius*20){
                        this.mag = this.radius*20;
                    }

                    this.arrowAngle = Math.atan2(currentTouchY - this.y, currentTouchX - this.x);

                    this.arrowPoints = rotateShape(this.arrowAngle, [this.x, this.y], [[0,0], [this.mag, this.radius*2], [this.mag, this.radius*6], [this.mag + this.radius*6, 0],[this.mag, -this.radius*6] ,[this.mag, -this.radius*2]]);

                    c.beginPath();
                    c.moveTo(this.x, this.y);
                    for(let i = 0; i < this.arrowPoints.length; i++){
                        c.lineTo(this.arrowPoints[i][0], this.arrowPoints[i][1]);
                    }
                    c.fillStyle = 'rgba(0, 255, 0, 0.7)';
                    c.fill();

                    this.arrowConfirmed = true;
                }
            }

            this.update = function() {

                this.timeSinceClick += 1; 
                this.draw();

                if(this.pathIndex >= this.pathCoords.length){
                    this.pathIndex=1;
                }
                
                if(!this.velocitySelect && !vm.touchSelect){
                    this.x = this.pathCoords[this.pathIndex][0];
                    this.y = this.pathCoords[this.pathIndex][1];
                    this.dx = this.pathVels[this.pathIndex][0];
                    this.dy = this.pathVels[this.pathIndex][1];
                    this.pathIndex += vm.animationSpeed;
                    vm.$emit('position-update', [this.x, this.y]);
                }
                
                if(vm.velocitySelect && Math.pow((Math.pow((mouseX-this.x),2) + Math.pow((mouseY-this.y),2)),1/2) < this.radius*1.5 && this.timeSinceClick > 20){
                    if(this.velocitySelect && this.newCoords.length > 0){
                        this.pathCoords = this.newCoords;
                        this.pathVels = this.newVels;
                        this.newCoords = [];
                        this.newVels = [];
                        this.pathIndex = 1; 
                    }

                    this.timeSinceClick = 0;
                    this.velocitySelect = !this.velocitySelect;
                }
                
                if(this.velocitySelect){
                    // if(ballArray.length = 1){
                    //     ballArray.push(new Ball(canvas.width/3, canvas.height/3, 10, undefined, undefined));
                    //     //console.log(ballArray);
                    // }
                    for(let i = 0; i < this.arrowCentres.length; i++){
                        if(vm.velocitySelect && Math.pow((Math.pow((mouseX-this.arrowCentres[i][0]),2) + Math.pow((mouseY-this.arrowCentres[i][1]),2)),1/2) < this.radius*2 && this.timeSinceClick > 20){
                            this.timeSinceClick = 0;
                            if(i == 0){
                                console.log('tangential out'); 
                                this.newdx += this.buttonStep * Math.cos(this.tanAngle);
                                this.newdy += this.buttonStep * Math.sin(this.tanAngle);
                            }
                            if(i == 1){
                                console.log('radial in');
                                this.newdx += this.buttonStep * Math.sin(this.tanAngle);
                                this.newdy += this.buttonStep * Math.cos(this.tanAngle);
                            }
                            if(i == 2){
                                console.log('tangential in');
                                this.newdx += -this.buttonStep * Math.cos(this.tanAngle);
                                this.newdy += -this.buttonStep * Math.sin(this.tanAngle);
                            }
                            if(i == 3){
                                console.log('radial out');
                                this.newdx += -this.buttonStep * Math.sin(this.tanAngle);
                                this.newdy += -this.buttonStep * Math.cos(this.tanAngle);
                            }
                            console.log('arrow Press');
                            this.path(this.newdx, this.newdy);
                        }
                    }
                } else {
                    this.newdx = this.dx;
                    this.newdy = this.dy;
                }

                //Change velocity and draw new path when touch released
                if(!vm.touchSelect && this.arrowConfirmed){
                    this.newdx = this.dx + (Math.cos(this.arrowAngle)) * (0.0005*this.mag/this.radius*20);
                    this.newdy = this.dy + (Math.sin(this.arrowAngle)) * (0.0005*this.mag/this.radius*20);
                    
                    newPath = true;
                    this.newCoords = [];
                    this.newVels = [];
                    this.path(this.newdx, this.newdy);;

                    if(this.newCoords.length > 0){
                        this.pathCoords = this.newCoords;
                        this.pathVels = this.newVels;
                        if(this.closedPath){
                            this.pathIndex = 1; 
                        } else{
                            this.pathIndex = Math.round(this.pathCoords.length/2);
                        }
                    }

                    this.arrowConfirmed = false;
                }
            }
        }
        
        //let maxRadius = 30;
        //let mouseRadius = 55;
        let ballArray = [];

        // [[x,y, mass]]
        //let massCentres = [[canvas.width/3, canvas.height/3], [2*canvas.width/3, canvas.height/3], [canvas.width/2, 2*canvas.height/3]];
        let massCentres = [[0, 0 , 100]];

        let initialVel = Math.sqrt((canvas.width/5)/massCentres[0][2]);

        ballArray.push(new Ball(canvas.width/5, 0, 5, undefined, undefined));
        for(let i = 0; i < ballArray.length; i++){
            ballArray[i].path();
        }

        function animate() {
            requestAnimationFrame(animate);

            for (let i = 0; i < ballArray.length; i++){

                // If statement fixes bug of rect not fully clearing when scale small
                if(1/ballArray[i].scale >= 1){
                c.clearRect(-canvas.width*(1/ballArray[i].scale)/2, -canvas.height*(1/ballArray[i].scale)/2, canvas.width*(1/ballArray[i].scale), canvas.height*(1/ballArray[i].scale));
                } else{
                    c.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
                }
                
                //bounding box
                // c.beginPath();
                // c.moveTo(-canvas.width*(1/ballArray[i].scale)/2, -canvas.height*(1/ballArray[i].scale)/2);
                // c.lineTo(canvas.width*(1/ballArray[i].scale)/2, -canvas.height*(1/ballArray[i].scale)/2);
                // c.lineTo(canvas.width*(1/ballArray[i].scale)/2, canvas.height*(1/ballArray[i].scale)/2);
                // c.lineTo(-canvas.width*(1/ballArray[i].scale)/2, canvas.height*(1/ballArray[i].scale)/2);
                // c.lineTo(-canvas.width*(1/ballArray[i].scale)/2, -canvas.height*(1/ballArray[i].scale)/2);
                // c.lineWidth = 1;
                // c.stroke();
            }

            mouseX = (vm.mouse.x - rect.left)*(1/ballArray[0].scale) - canvas.width/2;
            mouseY = (vm.mouse.y - rect.top )*(1/ballArray[0].scale) - canvas.height/2;
            currentTouchX = (vm.currentTouchPos.x - rect.left)*(1/ballArray[0].scale) - canvas.width/2;
            currentTouchY = (vm.currentTouchPos.y - rect.top)*(1/ballArray[0].scale) - canvas.height/2;
            // initialTouchX = (vm.initialTouchPos.x - rect.left - canvas.width/2)*(1/ballArray[0].scale);
            // initialTouchY = (vm.initialTouchPos.y - rect.top - canvas.height/2)*(1/ballArray[0].scale);

            for (let i = 0; i < ballArray.length; i++){
                ballArray[i].update();
            }

            for (let i = 0; i <massCentres.length; i++){
                c.beginPath();
                c.arc(massCentres[i][0], massCentres[i][1], vm.sunRadius, 0, Math.PI * 2); 
                c.fillStyle = 'Orange';
                c.fill();
            }

            // c.beginPath();
            // c.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
            // c.fillStyle = "black";
            // c.fill();
            
            // c.beginPath();
            // c.arc(2316, 669, 500, 0, Math.PI * 2); 
            // c.fillStyle = 'Red';
            // c.fill();
            
        }

        animate();

    }

}
</script>

<style>
#front-animation{
    /* border: 1px solid black; */
}
</style>