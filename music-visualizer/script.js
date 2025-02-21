let audioContext, analyser, audioElement, fileInput;
let isPlaying = false;

function setup() {
  createCanvas(windowWidth, 400);
  background(0);

  fileInput = document.getElementById('audio-upload');
  audioElement = document.getElementById('audio-player');

  // Wait for user interaction to start audio context
  document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  });

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    audioElement.src = url;

    // Initialize audio context and analyser
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioElement.play();
    isPlaying = true;
  });

  audioElement.addEventListener('play', () => {
    isPlaying = true;
  });

  audioElement.addEventListener('pause', () => {
    isPlaying = false;
  });
}

function draw() {
  if (!isPlaying) return;

  background(0);
  const waveform = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(waveform);

  // Draw waveform
  noFill();
  stroke(0, 255, 0);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    const x = map(i, 0, waveform.length, 0, width);
    const y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}