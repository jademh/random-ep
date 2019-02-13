import React, { useState, useEffect } from 'react';
import ShowPicker from './components/ShowPicker';
import ShowDetails from './components/ShowDetails';
import Credit from './components/Credit';
import shows from './shows';
import trackEvent from './tracking';
import { generateRandomInt, chooseRandomArrayItem } from './helpers';

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

export default function App() {
  const [showChosen, setShowChosen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [showId, setShowId] = useState(0);
  const [showName, setShowName] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [randomEpisodeDetails, setRandomEpisodeDetails] = useState(null);

  const pickRandomEp = () => {
    const randomSeason = chooseRandomArrayItem(seasons);
    const randomEpisode = generateRandomInt(1, randomSeason.episode_count);
    const fetchPath = `https://api.themoviedb.org/3/tv/${showId}/season/${
      randomSeason.season_number
    }/episode/${randomEpisode}?api_key=${API_KEY}&language=en-US`;
    fetch(fetchPath)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          throw new Error('UNAUTHORISED');
        }
        throw new Error('Request Failed');
      })
      .then(data => {
        if (data.season_number !== 0) {
          setRandomEpisodeDetails(data);
          setLoaded(true);
        } else {
          throw new Error('Season Zero Error');
        }
      })
      .catch(err => {
        if (err.message === 'UNAUTHORISED') {
          setError('An error has occured, please try again later... ');
        } else {
          // Pick another random episode
          pickRandomEp();
        }
      });
  };

  useEffect(() => {
    if (showId !== 0) {
      const fetchPath = `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&language=en-US`;
      fetch(fetchPath)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          if (response.status === 401) {
            throw new Error('UNAUTHORISED');
          }
          throw new Error('Request Failed');
        })
        .then(data => {
          setSeasons(data.seasons);
          setShowName(data.name);
          setShowChosen(true);
        })
        .catch(err => {
          if (err.message === 'UNAUTHORISED') {
            setError('An error has occured, please try again later... ');
          }
          setError('An error has occured, please refresh the page... ');
        });
    }
  }, [showId]);

  useEffect(() => {
    if (showChosen === true) {
      pickRandomEp();
    }
  }, [showChosen]);

  const updateVh = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  useEffect(() => {
    updateVh();
    window.addEventListener('resize', updateVh);
    return () => {
      window.removeEventListener('resize', updateVh);
    };
  }, []);

  if (error !== '') {
    return (
      <div className="loading">
        <span>{error}</span>
      </div>
    );
  }
  return (
    <div className="App">
      <ShowPicker
        active={!showChosen}
        shows={shows}
        onChangeShow={id => setShowId(id)}
      />
      {loaded && (
        <div className="results">
          <div className="toolbar">
            <button
              onClick={() => {
                setShowChosen(false);
                trackEvent('Button', 'click', 'Pick a different show');
              }}
            >
              <span>Pick a different show </span>
              <span role="img" aria-label="TV emoji">
                📺
              </span>
            </button>
            <button
              onClick={() => {
                pickRandomEp();
                trackEvent('Button', 'click', 'Pick random episode');
              }}
            >
              <span>Pick random episode </span>
              <span role="img" aria-label="sparkle emoji">
                ✨
              </span>
            </button>
          </div>
          <ShowDetails
            showName={showName}
            episodeDetails={randomEpisodeDetails}
          />
        </div>
      )}
      <Credit />
    </div>
  );
}
