document.write("<div class='slidercontainer'>")
document.write("<p id='textHour'>Tageseit: 12 Uhr</p>")
document.write("<input  type='range' min='8' max='20' value='12' class='slider' id='rangeHour'>")
document.write("<p id='textMonth'>Jahreszeit: Juni 2020</p>")
document.write("<input  type='range' min='0' max='11' value='6' class='slider' id='rangeMonth'>")
document.write("</div>")

AFRAME.registerComponent('sunlight', {
    init: function (){
        this.sunLightCalculation = new SunLight( 52.50, 13.45 );
        this.sunRoot = document.querySelector('#sunroot');
        this.sunLight = this.el;
        this.sunDistance = 30;
    },
    updateLight: function(time){
        this.sunLightCalculation.updateOrientation(time);
        this.sunRoot.object3D.quaternion.copy( new THREE.Quaternion() );
        this.sunLight.setAttribute('light', {intensity: this.sunLightCalculation.intensity*0.5});
    
    
            
        this.sunLight.object3D.position.copy( new THREE.Vector3(0, 0, -1) );
        this.sunLight.object3D.position.multiplyScalar( this.sunDistance );
        var rotator = new THREE.Quaternion();
        rotator.setFromAxisAngle( new THREE.Vector3(-1, 0, 0),-this.sunLightCalculation.elevation );
        this.sunRoot.object3D.quaternion.premultiply( rotator );
        rotator.setFromAxisAngle( new THREE.Vector3(0, -1, 0), this.sunLightCalculation.azimuth );
        this.sunRoot.object3D.quaternion.premultiply( rotator );
            //light1.computeTransformedInformation();
        this.update();
    }
})

var scene = document.querySelector('a-scene');

if (scene.hasLoaded) {
  run();
} else {
  scene.addEventListener('loaded', run);
}
function run (){
var sunLight = document.querySelector('#sunlight').components["sunlight"];
var currentTime = new Date(2019,5,15,12);
sunLight.updateLight(currentTime);

var sliderHour = document.getElementById("rangeHour");
var textHour = document.getElementById("textHour");
var textMonth = document.getElementById("textMonth");
sliderHour.oninput = function() {
    currentTime.setHours(this.value);
    textHour.innerHTML = "Tageszeit: "+currentTime.toLocaleString('de-DE', {hour: '2-digit' });
    sunLight.updateLight(currentTime);
} 
var sliderMonth = document.getElementById("rangeMonth");
sliderMonth.oninput = function() {
    currentTime.setMonth(this.value);
    textMonth.innerHTML = "Jahreszeit: "+currentTime.toLocaleString('de-DE', {year: 'numeric', month: 'long'});
    sunLight.updateLight(currentTime);
} 
}