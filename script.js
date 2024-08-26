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

navigator.geolocation.getCurrentPosition(position => {
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  const map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  function onMapClick(e) {
    // const { lat } = e.latlng;
    // const { lng } = e.latlng;
    form.classList.remove('hidden');
    // L.marker([lat, lng]).addTo(map);
    // //   .bindPopup(L.popup({ autoClose: false, closeOnClick: false }))
    // //   .openPopup();
    // const popup = L.popup({
    //   autoClose: false,
    //   closeOnClick: false,
    //   maxWidth: 200,
    //   minWidth: 100,
    //   className: 'running-popup',
    // });
    // popup.setLatLng(e.latlng).setContent('Running').openOn(map);
  }

  map.on('click', onMapClick);
});

inputType.addEventListener('change', () => {
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
