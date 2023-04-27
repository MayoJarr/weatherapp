import './styles/App.css';
import Day from './components/Day';
import {useEffect, useState} from 'react'
import Place from './components/Place';
import Hour from './components/Hour';

function App() {
  const apikey = '316cd4780f98abf47235cb4db1137e54'
  let [places, setPlaces] = useState([])
  let [currentPlace, setCurrentPlace] = useState(null)
  let [searchResults, setSeatchResults] = useState([])

  let lon = 0;
  let lat = 0;

  let [isPlacesVisible, setIsPlacesVisible] = useState(false);

  useEffect(() => {
      console.log(`${lon} ${lat}`)
      test()
  }, [])
  //  CURRENT WEATHER
  const fetchDataFromApi = async (la, lo) => {
    let fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${la}&lon=${lo}&appid=${apikey}&units=metric`)
    let data = await fetchData.json()
    return data
  }
  // FORECAST
  const getForecast = async (la, lo) => {
    let fetchData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${la}&lon=${lo}&appid=${apikey}&units=metric`)
    let data = await fetchData.json()
    return data
  }
  // SEARCH LOCALISATION
  const search = async (localisation) => {
    if (localisation.length <= 0){
      return
    }
    else if (localisation.length > 0) {
      let fetchData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${localisation}&limit=5&appid=${apikey}`)
      let data = await fetchData.json()
      setSeatchResults(searchResults = data)
      console.log(data)
    }
  }
  // SELECT LOCALISATION
  const addPlace = async (e) => {
    lon = e.lon.toFixed(2)
    lat = e.lat.toFixed(2)
    let data = await fetchDataFromApi(e.lat, e.lon)
    let foreData = await getForecast(e.lat, e.lon);
    setPlaces(places.concat({name: e.name, lat: e.lat, lon: e.lon, country: e.country, temp: data.main.temp, forecast: formatData(foreData), hourly: formatDataToHours(foreData)}))
  }
  const choosePlace = e => {
    lon = e.lon.toFixed(2)
    lat = e.lat.toFixed(2)
    let eo = places.findIndex(place => place.lon === e.lon)
    setCurrentPlace(currentPlace = places[eo])
  }
  const test = async () => {
    let data = await fetchDataFromApi(50.78, 17.06)
    let foreData = await getForecast(50.78, 17.06)
    setPlaces(places = [{
      name: 'Strzelin',
      lat: 50.78,
      lon: 17.06,
      country: 'PL',
      temp: data.main.temp,
      forecast: formatData(foreData),
      hourly: formatDataToHours(foreData)
    }])
    setCurrentPlace(currentPlace = places[0])
    formatDataToHours(foreData)
  }
  const getAvgTempOfDay = (days) => {
    let sum = 0;
    days.forEach(hour => {
      sum += hour.main.temp
    })
    return sum / days.length
  }
  const getHighestOfDay = (day) => day.reduce((acc, curr) => curr.main.temp > acc ? curr.main.temp : acc, 0)
  
  const formatData = data => {
    data.list.map(e => e.dt = new Date(e.dt * 1000))
    let prev = data.list[0].dt.getDate();
    let curr;
    let eo = [[]]
    let num = 0;
    data.list.forEach(e => {
      curr = e.dt.getDate()
      if (curr === prev) {
        eo[num].push(e)
      }
      else if (curr !== prev) {
        num +=1;
        eo.push([])
        eo[num].push(e)
      }
      prev = e.dt.getDate()
    })
    let thing = [];
    eo.forEach(day => {
      thing.push({
        name: day[0].dt.toLocaleString('pl-pl', {weekday:'long'}),
        // temp: getAvgTempOfDay(day).toFixed(1),
        temp: getHighestOfDay(day).toFixed(1),
        date: day[0].dt.getDate()
      })
    })
    return thing
  }
  const formatDataToHours = data => {
    let arr = []
    let hour = 0;
    data.list.forEach(item => {
      hour = item.dt.getHours().toString() + ':00'
      if (hour.length === 4){
        hour = '0' + hour
      }
      arr.push({hour: hour, temp: item.main.temp.toFixed(1)})
    })
    return arr
  }
  const togglePlaces = () => setIsPlacesVisible(isPlacesVisible = !isPlacesVisible);
  let i = 1;
  return (
    <div className="App">
      <div className={isPlacesVisible ? 'overlay overlayActive' : 'overlay'} onClick={()=>togglePlaces()}></div>
      <button className='placesBtn' onClick={() => togglePlaces()}>|||</button>
      <div className={isPlacesVisible ? 'Places active' : 'Places'}><Place 
        places={places} 
        searchResult={searchResults} 
        search={search}
        addPlace={addPlace}
        choosePlace={choosePlace}
      /></div>
      <div className='Degrees'>
        <div className='degreeContainer'>
          <div className='placeName'>{currentPlace != null ? `${currentPlace.name}, ${currentPlace.country}`: 'no data'}</div>
          <div className='placeDegrees'>
            {currentPlace != null ? currentPlace.temp : 'no data'}&#8451;
          </div>
        </div>
      </div>
      <div className='Hours'>
        {currentPlace != null ? currentPlace.hourly.map(item => <Hour hour={item.hour} temp={item.temp} key={i++}/>) : 'no data'}
      </div>
      <div className='Days'>
        {currentPlace != null ? currentPlace.forecast.map(item => <Day dayName={item.name} degrees={item.temp} key={item.date}/>) : 'no data'}
      </div>
      <div className='footer'>Copyright © 2023 Jakub Majecki <a href='https://github.com/MayoJarr'>MayoJarr</a></div>
    </div>
  );
}

export default App;

//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key} geocoding
//http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=316cd4780f98abf47235cb4db1137e54&units=metric 5 days 3 hours
