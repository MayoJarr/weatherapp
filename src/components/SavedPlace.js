// eslint-disable
import React from 'react';
import '../styles/Place.css';

function SavedPlace({ place, choose, deletePlace }) {
  return (
    <div className="place">
      <div onClick={() => choose(place)}>
        {place.name}
        ,
        {' '}
        {place.country}
      </div>
      <button className="deleteBtn" onClick={() => deletePlace(place)}>X</button>
    </div>
  );
}

export default SavedPlace;
