const fftStartingPoint = 0; 
//whenever page is refreshed, new set of startColour and endColour appears
const gradients = [
  {start: [16, 141, 199], end: [239, 142, 56]},
  {start: [247, 255, 0], end: [219, 54, 164]},
  {start: [33, 95, 0], end: [228, 228, 217]},
  {start: [222, 98, 98], end: [255, 184, 140]},
  {start: [251, 211, 233], end: [187, 55, 125]},
  {start: [67, 206, 162], end: [24, 90, 157]}
];

let startColor;
let endColor;
let rotateAngle = 0;
let sound;
let fft;

function setup() {
  const cnv = createCanvas(600, 600);
  
  cnv.mouseClicked(() => { 
    if (sound && sound.isPlaying()) {
      sound.pause();
    } else if (sound && !sound.isPlaying()) {
      sound.play();
    }
  });
  
  //fft(Fast Fourier Transform) analyses the frequency of the soundwave
  fft = new p5.FFT(0.05);
  colorMode(RGB);
  startColor = color(0, 0, 0);
  endColor = color(0, 0, 0);
}

//to draw the ellipse 
function draw() {
  background(0);
  translate(width / 2, height / 2);
  
  rotate(rotateAngle);
  rotateAngle += 10;
  
  noFill();
  stroke(255);
  ellipse(0, 0, 100, 100);
  
  const spectrum = fft.analyze();
  const spectrumValues = [];
    
  //this code is to create the soundwaves/spectrum
  for (let i = fftStartingPoint; i < ((TWO_PI) + fftStartingPoint)*100; i++) {
    spectrumValues.push((spectrum[i] + spectrum[i + 1], spectrum[i + 2]));
  }
 
  
  //this chunk of code is for the mapping and placement of the spectrum into the ellipse
  let count = 0;
  let angle = 0.0;
  let incrementOne = 0.0;
  let incrementTwo = 0.0;
  let increment =  0.0128;
  let lerpy;
  
  for (let i = 0; i < TWO_PI; i+= 0.03) {
    const x = sin(i) * 50;
    const y = cos(i) * 50;
    
    if (i < PI) {
      lerpy = lerpColor(startColor, endColor, 0.0128);
    } else {
      lerpy = lerpColor(endColor, startColor, 0.0128);
    }
    
    stroke(lerpy);
    push();
    translate(x, y);
    rotate(-angle);
    rect(0, 0, 0, map(spectrumValues[count], 0, 80, 0, 80));
    pop();
    count++;
    angle += 1;
  }
}

document.getElementById('audiofile').onchange = (event) => {
  if (event.target.files[0]) {
    if (sound && sound.isPlaying()) {
      sound.disconnect();
      sound.stop();
    }
    
    sound = loadSound(URL.createObjectURL(event.target.files[0]), () => {
      const { start, end } = gradients[Math.floor(Math.random() * gradients.length)];
      
      startColor = color(start[0], start[1], start[2]);
      endColor = color(end[0], end[1], end[2]);
      
      sound.play();
    });
  }
}
