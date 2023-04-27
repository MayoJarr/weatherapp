import React, { useState } from "react";
import "../styles/Place.css";
import SavedPlace from "./SavedPlace";

function Place({
  places,
  searchResult,
  search,
  addPlace,
  choosePlace,
  deletePlace,
}) {
  let [value, setValue] = useState("London");
  let [isListVisible, setIsListVisible] = useState(false);

  const handleInput = (e) => {
    setValue((value = e.target.value));
    search(value);
  };
  const toggleList = () => setIsListVisible((isListVisible = !isListVisible));

  return (
    <div className="places">
      <div className="search">
        <input
          type="text"
          className={`searchInput ${isListVisible ? "active" : ""}`}
          onChange={handleInput}
          onClick={() => toggleList()}
        />
        <input
          type="submit"
          className={`searchSubmit ${isListVisible ? "active" : ""}`}
          value="O"
          onClick={() => {
            search(value);
            toggleList();
          }}
        />
        {isListVisible ? (
          <ul className={`searchList ${isListVisible ? "activeList" : ""}`}>
            {searchResult.map((result, index) => (
              <li
                className="placeLi"
                onClick={() => {
                  addPlace(result);
                  toggleList();
                }}
                value={[result.lat, result.lon]}
                key={index}
              >{`${result.name}, ${result.state}, ${result.country}`}</li>
            ))}
          </ul>
        ) : <></>}
      </div>
      <div className="savedPlaces">
        {places.map((place, index) => (
          <SavedPlace
            choose={choosePlace}
            place={place}
            key={index}
            deletePlace={deletePlace}
          />
        ))}
      </div>
    </div>
  );
}

export default Place;
