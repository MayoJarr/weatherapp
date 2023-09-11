/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Day from './components/Day';
import Place from './components/Place';
import Hour from './components/Hour';

function App() {
  const apikey = '316cd4780f98abf47235cb4db1137e54';
  let [places, setPlaces] = useState([]);
  let [currentPlace, setCurrentPlace] = useState(null);
  let [searchResults, setSeatchResults] = useState([]);

  let [isPlacesVisible, setIsPlacesVisible] = useState(false);

  //  CURRENT WEATHER
  const fetchDataFromApi = async (la, lo) => {
    const fetchData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${la}&lon=${lo}&appid=${apikey}&units=metric`,
    );
    const data = await fetchData.json();
    return data;
  };
  // FORECAST
  const getForecast = async (la, lo) => {
    const fetchData = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${la}&lon=${lo}&appid=${apikey}&units=metric`,
    );
    const data = await fetchData.json();
    return data;
  };
  // SEARCH LOCALISATION
  const search = async (localisation) => {
    if (localisation.length <= 0) {
      return;
    }
    // } else if (localisation.length > 0) {
    const fetchData = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${localisation}&limit=5&appid=${apikey}`,
    );
    const data = await fetchData.json();
    setSeatchResults((searchResults = data));
    // }
  };

  // const getAvgTempOfDay = (days) => {
  //   let sum = 0;
  //   days.forEach((hour) => {
  //     sum += hour.main.temp;
  //   });
  //   return sum / days.length;
  // };
  // eslint-disable-next-line max-len
  const getHighestOfDay = (day) => day.reduce((acc, curr) => (curr.main.temp > acc ? curr.main.temp : acc), 0);
  const formatData = (data) => {
    // eslint-disable-next-line no-return-assign
    data.list.map((e) => (e.dt = new Date(e.dt * 1000)));
    let prev = data.list[0].dt.getDate();
    let curr;
    const eo = [[]];
    let num = 0;
    data.list.forEach((e) => {
      curr = e.dt.getDate();
      if (curr === prev) {
        eo[num].push(e);
      } else if (curr !== prev) {
        num += 1;
        eo.push([]);
        eo[num].push(e);
      }
      prev = e.dt.getDate();
    });
    const thing = [];
    eo.forEach((day) => {
      const dayMiddle = Number((day.length / 2).toFixed(0));
      thing.push({
        name: day[0].dt.toLocaleString('en-en', { weekday: 'long' }),
        // temp: getAvgTempOfDay(day).toFixed(1),
        temp: getHighestOfDay(day).toFixed(0),
        date: day[0].dt.getDate(),
        icon: day[dayMiddle === 1 ? 0 : dayMiddle].weather[0].icon,
      });
    });
    return thing;
  };
  const formatDataToHours = (data) => {
    const arr = [];
    let hour = 0;
    data.list.forEach((item) => {
      hour = `${item.dt.getHours().toString()}:00`;
      if (hour.length === 4) {
        hour = `0${hour}`;
      }
      arr.push({ hour, temp: item.main.temp.toFixed(0), icon: item.weather[0].icon });
    });
    return arr;
  };
  const test = async () => {
    const data = await fetchDataFromApi(51.10, 17.03);
    const foreData = await getForecast(51.10, 17.03);
    setPlaces(
      (places = [
        {
          name: 'Wroclaw',
          lat: 51.10,
          lon: 17.03,
          country: 'PL',
          temp: data.main.temp,
          forecast: formatData(foreData),
          hourly: formatDataToHours(foreData),
        },
      ]),
    );
    // eslint-disable-next-line prefer-destructuring
    setCurrentPlace((currentPlace = places[0]));
    formatDataToHours(foreData);
  };
  const choosePlace = (e) => {
    const eo = places.findIndex((place) => place.lon === e.lon);
    setCurrentPlace((currentPlace = places[eo]));
  };
  // SELECT LOCALISATION
  const addPlace = async (e) => {
    const data = await fetchDataFromApi(e.lat, e.lon);
    const foreData = await getForecast(e.lat, e.lon);
    const placeObj = {
      name: e.name,
      lat: e.lat,
      lon: e.lon,
      country: e.country,
      temp: data.main.temp,
      forecast: formatData(foreData),
      hourly: formatDataToHours(foreData),
    };
    setPlaces(places.concat(placeObj));
    setCurrentPlace(currentPlace = placeObj);
  };

  const deletePlace = (place) => setPlaces(places.filter((element) => element.lat !== place.lat));

  const togglePlaces = () => {
    setIsPlacesVisible((isPlacesVisible = !isPlacesVisible));
  };

  let i = 1;

  useEffect(() => {
    test();
  }, []);

  return (
    <div className="App">
      <div
        className={isPlacesVisible ? 'overlay overlayActive' : 'overlay'}
        onClick={() => togglePlaces()}
      />
      <button className="placesBtn" onClick={() => togglePlaces()}>
        |||
      </button>
      <div className={isPlacesVisible ? 'Places active' : 'Places'}>
        <Place
          places={places}
          searchResult={searchResults}
          search={search}
          addPlace={addPlace}
          choosePlace={choosePlace}
          deletePlace={deletePlace}
        />
      </div>
      <div className="Degrees">
        <div className="degreeContainer">
          <div className="placeName">
            {currentPlace != null ? `${currentPlace.name}, ${currentPlace.country}` : 'no data'}
          </div>
          <div className="placeDegrees">
            {currentPlace != null ? currentPlace.temp.toFixed(0) : 'no data'}
            &#8451;
          </div>
        </div>
      </div>
      <div className="Hours">
        {currentPlace != null
          // eslint-disable-next-line max-len
          ? currentPlace.hourly.map((item) => <Hour hour={item.hour} temp={item.temp} icon={item.icon} key={i++} />)
          : 'no data'}
      </div>
      <div className="Days">
        {currentPlace != null
          ? currentPlace.forecast.map((item) => (
            <Day dayName={item.name} degrees={item.temp} icon={item.icon} key={item.date} />
          ))
          : 'no data'}
      </div>
      <div className="footer">
        Copyright © 2023 Jakub Majecki
        {' '}
        <a href="https://github.com/MayoJarr">MayoJarr</a>
      </div>
    </div>
  );
}
export default App;
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key} geocoding
// http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=316cd4780f98abf47235cb4db1137e54&units=metric 5 days 3 hours
