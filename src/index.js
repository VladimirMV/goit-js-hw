import './css/styles.css';

import _debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import fetchCountries from './js/fetchCountries.js';

import templateCountryList from './templates/country-list.hbs';
import templateCountryInfo from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  _debounce(onSearchCountryInput, DEBOUNCE_DELAY)
);

const clearMarkup = element => (element.innerHTML = '');
const changeBorderColor = color => (refs.inputEl.style.backgroundColor = color);

function onSearchCountryInput(event) {
  clearMarkup(refs.countryListEl);
  clearMarkup(refs.countryInfoEl);

  changeBorderColor('white');

  if (!event.target.value.trim()) {
    return;
  }

  fetchCountries(event.target.value.trim())
    .then(countries => { 

        console.log(countries);
    console.log(event.target.value.trim());

      if (countries.length > 10) {
        Notify.info(
          '⚠️Too many matches found. Please enter a more specific name.'
        );
        changeBorderColor('lightblue');
        return;
      }
      renderMarkup(countries);
    });
    // .catch(() => {
    //   Notify.failure('❌Oops, there is no country with that name');
    //   changeBorderColor('lightcoral');
    // });
}

function renderMarkup(countries) {
  changeBorderColor('khaki');

  let markupInfo = '';
  let markupList = '';

  if (countries.length >= 2) {
    markupList = countries.reduce(
      (previousValue, currentValue) =>
        (previousValue += templateCountryList(currentValue)),
      ''
    );
  } else {
    
    markupList = templateCountryList(...countries);
    console.log("markupList = ", markupList);
    console.log(" Делаем markupInfo =" ,...countries);
    markupInfo = templateCountryInfo(...countries);
    

    console.log("markupInfo =",markupInfo);
    changeBorderColor('lightgreen');

    refs.countryInfoEl.insertAdjacentHTML('afterbegin', markupInfo);
  }

  refs.countryListEl.insertAdjacentHTML('afterbegin', markupList);
}

 