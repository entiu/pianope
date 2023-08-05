var allChords = [];
var stored = localStorage['chords'];
var piano = document.querySelector('.piano');
var chord = document.querySelector('#chord');
var chordName = document.querySelector('#chord-name');
var chordSubmit = document.querySelector('#chord-submit');
var chordList = document.querySelector('#chord-list');

var buildPiano = function() {
  piano.innerHTML = `
  <div class="octave" id="octave_0">
    <div class="key white" id="A0"></div>
    <div class="key black" id="Bb0" style="--left: 40%;"></div>
    <div class="key white" id="B0"></div>
  </div>
  `

  for (i = 1; i <= 7; i++) {
    piano.innerHTML += `
    <div class="octave" id="octave_${i}">
      <div class="key white" id="C${i}"></div>
      <div class="key black" id="Db${i}" style="--left: 10%;"></div>
      <div class="key white" id="D${i}"></div>
      <div class="key black" id="Eb${i}" style="--left: 25%;"></div>
      <div class="key white" id="E${i}"></div>
      <div class="key white" id="F${i}"></div>
      <div class="key black" id="Gb${i}" style="--left: 54%;"></div>
      <div class="key white" id="G${i}"></div>
      <div class="key black" id="Ab${i}" style="--left: 68%;"></div>
      <div class="key white" id="A${i}"></div>
      <div class="key black" id="Bb${i}" style="--left: 82%;"></div>
      <div class="key white" id="B${i}"></div>
    </div>
    `
  }

  piano.innerHTML += `
  <div class="octave" id="octave_8">
    <div class="key white" id="C8"></div>
  </div>
  `
}

var writeChord = function() {
  var selectedKeys = piano.querySelectorAll('.key.selected');
  var chord = [];
  selectedKeys.forEach(key => chord.push(key.id));
  return chord.join(', ');
}

var addChord = function(chord) {
  var newChord = document.createElement('div');
  newChord.classList.add('chord');
  newChord.id = chord.id;
  var newChord_name = document.createElement('p');
  newChord_name.classList.add('chord-name');
  var newChord_keys = document.createElement('p');
  newChord_keys.classList.add('chord-keys');
  // debugger;
  if (chord.name) {
    newChord_name.textContent = chord.name;
  } else {
    newChord_name.textContent = 'Untitled';
    newChord_name.classList.add('untitled');
  }
  newChord_keys.textContent = chord.keys;
  newChord.appendChild(newChord_name);
  newChord.appendChild(newChord_keys);
  chordList.appendChild(newChord);
}

var saveChord = function(chord) {
  // chord.id = Math.floor(Math.random() * Date.now()).toString(16);
  allChords.push(chord);
  localStorage['chords'] = JSON.stringify(allChords);
}

var playNote = function(key) {
  var note = new Audio(`notes/${key}.mp3`);
  note.play();
}

var clearPiano = function() {
  var selectedKeys = piano.querySelectorAll('.key.selected');
  selectedKeys.forEach(key => key.classList.remove('selected'));
  chord.textContent = '';
  chordName.value = '';
}

function Chord(id = Math.floor(Math.random() * Date.now()).toString(16), name, keysIds) {
  this.id = id;
  this.name = name;
  this.keysIds = keysIds;
  this.keys = keysIds.split(', ').map(x => x.slice(0, -1));
}

piano.addEventListener('click', e => {
  var key = e.target;
  key.classList.toggle('selected');
  chord.textContent = writeChord();
})

chordSubmit.addEventListener('click', () => {
  if (!chord.textContent) return;

  var name = chordName.value;
  var keysIds = chord.textContent;
  var newChord = new Chord(undefined, name, keysIds);
  addChord(newChord);
  saveChord(newChord);
  clearPiano();
})

chordList.addEventListener('click', e => {
  var target = e.target;
  if (!target.classList.contains('chord')) return;
  
  if (target.classList.contains('selected-preview')) {
    target.classList.remove('selected-preview');
    piano.querySelectorAll('.key.selected-preview').forEach(key => key.classList.remove('selected-preview'));
  } else {
    var chord = allChords.find(c => c.id === target.id);
    var currentlySelected = chordList.querySelector('.selected-preview');
    if (currentlySelected) {
      currentlySelected.classList.remove('selected-preview');
      piano.querySelectorAll('.key.selected-preview').forEach(key => key.classList.remove('selected-preview'));
      
    }
    target.classList.add('selected-preview');
    chord.keysIds.split(', ').forEach(keyId => {
      playNote(keyId);
      piano.querySelector(`.key#${keyId}`).classList.toggle('selected-preview');
    })
  }
})

if (stored) {
  allChords = JSON.parse(stored);
  allChords.forEach(chord => addChord(chord))
}

function doc_keyUp(e) {
  if (e.altKey && e.code === 'KeyS') {
    piano.querySelectorAll('.key.selected').forEach(key => playNote(key.id));
  }
}

document.addEventListener('keyup', doc_keyUp, false);

buildPiano();