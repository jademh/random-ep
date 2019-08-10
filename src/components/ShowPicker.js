import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { chooseRandomArrayItem } from '../helpers';
import trackEvent from '../tracking';
import '../styles/show-picker.scss';

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

export default function ShowPicker(props) {
  const [showField, setShowField] = useState('');
  const [searchInFocus, setSearchInFocus] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState([]);
  const { active, shows, onChangeShow, forgetShows } = props;

  const onShowChange = (event, { newValue }) => {
    setShowField(newValue);
  };

  const onSearchFocus = () => {
    setSearchInFocus(true);
  };

  const onSearchBlur = () => {
    setSearchInFocus(false);
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
    const { id, name } = suggestion;
    onChangeShow({ id, name });
    trackEvent('Search', 'select', name);
  };

  return (
    <section className={`showPicker ${active ? 'st-active' : ''}`}>
      <div className="showPicker_panel">
        <h1>Random Episode</h1>
        <div
          className={`autosuggest-wrapper ${searchInFocus ? 'st-active' : ''}`}
        >
          <Autosuggest
            suggestions={showSuggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={suggestion => suggestion.name}
            renderSuggestion={suggestion => <span>{suggestion.name}</span>}
            inputProps={{
              placeholder: 'Search for a show... 🔎',
              value: showField,
              onChange: onShowChange,
              tabIndex: active ? null : -1,
              onFocus: onSearchFocus,
              onBlur: onSearchBlur,
            }}
            highlightFirstSuggestion
            focusInputOnSuggestionClick={false}
          />
        </div>
        {shows.length > 0 && (
          <div className="showPicker_list">
            {shows.map(show => {
              const { id, name } = show;
              return (
                <button
                  key={id}
                  value={id}
                  tabIndex={active ? null : -1}
                  onClick={() => {
                    onChangeShow({ id, name });
                    trackEvent('Button', 'click', name);
                  }}
                >
                  {name}
                </button>
              );
            })}
            <button
              tabIndex={active ? null : -1}
              onClick={() => {
                const { id, name } = chooseRandomArrayItem(shows);
                onChangeShow({ id, name });
                trackEvent('Button', 'click', `Surprise Me: ${name}`);
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
            <button
              tabIndex={active ? null : -1}
              class="forgetMe"
              onClick={forgetShows}
            >
              <span role="img" aria-label="trash emoji">
                🗑
              </span>
              <span> Forget my shows</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
