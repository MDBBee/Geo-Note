'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #coords;
  constructor() {
    navigator.geolocation.getCurrentPosition(
      this._getPosition.bind(this),
      function () {
        alert('Location denied');
      }
    );
  }

  _getPosition(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    this.#coords = [latitude, longitude];
    this._loadMap(this.#coords);
  }

  _loadMap(position) {
    const map = L.map('map').setView(position, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
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

// const app = new App();
