import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { chooseRandomArrayItem } from '../helpers';
import trackEvent from '../tracking';
import '../styles/show-picker.scss';

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

export default function ShowPicker(props) {
  const [showField, setShowField] = useState('');
  const [showSuggestions, setShowSuggestions] = useState([]);
  const { active, shows, onChangeShow } = props;

  const onShowChange = (event, { newValue }) => {
    setShowField(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    let suggestions = [];
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) {
      setShowSuggestions(suggestions);
      return;
    }

    const searchPath = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${inputValue}&page=1&include_adult=false`;
    fetch(searchPath)
      .then(response => response.json())
      .then(data => {
        suggestions = data.results;
        if (suggestions.length > 5) {
          suggestions.length = 5;
        }
        setShowSuggestions(suggestions);
      });
  };

  const onSuggestionsClearRequested = () => {
    setShowSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setShowField('');
    onChangeShow(suggestion.id, suggestion.name);
    trackEvent('Search', 'select', suggestion.name);
  };

  return (
    <section className={`showPicker ${active ? 'st-active' : ''}`}>
      <div className="showPicker_panel">
        <h1>Random Episode</h1>
        <Autosuggest
          suggestions={showSuggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={suggestion => suggestion.name}
          renderSuggestion={suggestion => <span>{suggestion.name}</span>}
          inputProps={{
            placeholder: 'Search for a show... 📺🔎',
            value: showField,
            onChange: onShowChange,
          }}
        />
        <div className="showPicker_list">
          {shows.map(show => {
            return (
              <button
                key={show.id}
                value={show.id}
                onClick={() => {
                  onChangeShow(show.id, show.name);
                  trackEvent('Button', 'click', show.name);
                }}
              >
                {show.name}
              </button>
            );
          })}
          <button
            onClick={() => {
              const randomShow = chooseRandomArrayItem(shows);
              onChangeShow(randomShow.id, randomShow.name);
              trackEvent('Button', 'click', `Surprise Me: ${randomShow.name}`);
            }}
          >
            <span role="img" aria-label="crystal ball emoji">
              🔮
            </span>
            <span> Surprise Me </span>
            <span role="img" aria-label="crystal ball emoji">
              🔮
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
