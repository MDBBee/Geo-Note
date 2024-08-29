'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  id = String(Date.now()).slice(-5);
  date = new Date();
  distance;
  duration;
  constructor(distance, duration) {
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const month = months[this.date.getMonth()];
    const day = this.date.getDate();
    return `${
      this.name === 'Running' ? 'Running' : 'Cycling'
    } on ${month} ${day}`;
  }
}

class Running extends Workout {
  name = 'Running';
  constructor(distance, duration, cadence) {
    super(distance, duration);
    this.cadence = cadence;
    this.description = this._setDescription();
    this.spm = this._calcSPM();
    this.speed = this._calcSpeed();
  }

  _calcSPM() {
    return this.duration / this.distance;
  }
  _calcSpeed() {
    return this.distance / this.duration;
  }
}
class Cycling extends Workout {
  name = 'Cycling';

  constructor(distance, duration, elevationGain) {
    super(distance, duration);
    this.elevationGain = elevationGain;
    this.description = this._setDescription();
    this.speed = this._calcSpeed();
  }

  _calcSpeed() {
    return this.distance / this.duration;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// console.log(new Running(2, 4, 6));

class App {
  #map;
  #markerE;
  #workouts = [];

  constructor() {
    navigator.geolocation.getCurrentPosition(
      this._getPosition.bind(this),
      function () {
        alert('Location denied');
      }
    );

    inputType.addEventListener('change', this._toggleField);
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this._loadMap(coords);
    this.#map.addEventListener('click', this._showForm.bind(this));
  }

  _loadMap(position) {
    this.#map = L.map('map').setView(position, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }

  _newWorkout(e) {
    let wkOut;
    e.preventDefault();
    wkOut = this._retrieveteWorkoutData();

    //render Marker
    this._renderMarker(wkOut);

    //render workoutlist
    // hideform
    this._hideForm();

    // showlist
    this._workoutlist(wkOut);
  }
  _workoutlist(wkOut) {
    let html = '';
    if (wkOut.name === 'Running') {
      html += `
              <li class="workout workout--${
                wkOut.name[0].toLowerCase() + wkOut.name.slice(1)
              }" data-id="${wkOut.id}">
                <h2 class="workout__title">${wkOut.description}</h2>
                <div class="workout__details">
                  <span class="workout__icon">🏃‍♂️</span>
                  <span class="workout__value">${wkOut.distance}</span>
                  <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⏱</span>
                  <span class="workout__value">${wkOut.duration}</span>
                  <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⚡️</span>
                  <span class="workout__value">${wkOut.speed}</span>
                  <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">🦶🏼</span>
                  <span class="workout__value">${wkOut.spm}</span>
                  <span class="workout__unit">spm</span>
                </div>
              </li>`;
    }
    if (wkOut.name === 'Cycling') {
      html += `
              <li class="workout workout--${
                wkOut.name[0].toLowerCase() + wkOut.name.slice(1)
              }" data-id="${wkOut.id}">
                <h2 class="workout__title">${wkOut.description}</h2>
                <div class="workout__details">
                  <span class="workout__icon">🚴‍♂️</span>
                  <span class="workout__value">${wkOut.distance}</span>
                  <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⏱</span>
                  <span class="workout__value">${wkOut.duration}</span>
                  <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⚡️</span>
                  <span class="workout__value">${wkOut.speed}</span>
                  <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⛰</span>
                  <span class="workout__value">${wkOut.elevationGain}</span>
                  <span class="workout__unit">m</span>
                </div>
              </li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _retrieveteWorkoutData() {
    let type = inputType.value;
    let distance = +inputDistance.value;
    let duration = +inputDuration.value;

    const allPositive = inp => inp > 0;
    const allNumbers = inp => isFinite(inp);

    if (type === 'running') {
      let cadence = inputCadence.value;
      const inputs = [distance, duration, cadence];
      if (inputs.every(allPositive) && inputs.every(allNumbers)) {
        const run = new Running(distance, duration, cadence);
        this.#workouts.push(run);

        inputDistance.value = inputDuration.value = inputCadence.value = '';
        return run;
      } else alert('!all input filed should field with positive numbers');
    }
    if (type === 'cycling') {
      let elevation = inputElevation.value;
      const inputs = [distance, duration];
      if (inputs.every(allPositive) && inputs.every(allNumbers)) {
        const cycle = new Cycling(distance, duration, elevation);
        this.#workouts.push(cycle);
        console.log(cycle);
        inputDistance.value = inputDuration.value = inputElevation.value = '';
        return cycle;
      } else alert('!all input filed should field with positive numbers');
    }
  }

  _renderMarker(wkOut) {
    const { lat } = this.#markerE.latlng;
    const { lng } = this.#markerE.latlng;

    const marker = L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          maxHeight: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${
            wkOut.name === 'Cycling' ? 'cycling' : 'running'
          }-popup`,
        }).setContent(
          `${wkOut.name === 'Cycling' ? '🚴' : '🏃‍♂️'} ${wkOut.description}`
        )
      )
      .openPopup();
  }

  _showForm(e) {
    this.#markerE = e;

    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    form.classList.add('hidden');
    inputDistance.blur();
  }

  _toggleField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
}

// navigator.geolocation.getCurrentPosition(function (position) {
//   const { latitude } = position.coords;
//   const { longitude } = position.coords;
//   const map = L.map('map').setView([latitude, longitude], 13);

//   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution:
//       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   }).addTo(map);

//   function onMapClick(e) {
//     const { lat } = e.latlng;
//     const { lng } = e.latlng;

//     const marker = L.marker([lat, lng])
//       .addTo(map)
//       .bindPopup(
//         L.popup({
//           maxWidth: 250,
//           maxHeight: 100,
//           autoClose: false,
//           closeOnClick: false,
//           className: 'cycling-popup',
//         }).setContent('An exercise!')
//       )
//       .openPopup();
//   }

//   map.on('click', onMapClick);
// });

const app = new App();
