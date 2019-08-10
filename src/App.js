import React, { useState, useEffect, useRef } from 'react';
import ShowPicker from './components/ShowPicker';
import ShowDetails from './components/ShowDetails';
import Credit from './components/Credit';
import shows from './shows';
import trackEvent from './tracking';
import { generateRandomInt, chooseRandomArrayItem } from './helpers';

export default function App() {
  const [showList, setShowList] = useState([]);
  const [error, setError] = useState('');
  const [showPickerActive, setShowPickerActive] = useState(true);
  const [show, setShow] = useState({ id: 0, name: '' });
  const [showInfo, setShowInfo] = useState({});
  const [randomEpisodeDetails, setRandomEpisodeDetails] = useState(null);
  const resultContainer = useRef(null);
  const showPickerContainer = useRef(null);

  const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
  const SHOW_LIST_STORAGE = 'randomEpShows';
  const SHOW_LIST_LENGTH_CAP = 5;

  let addShowTimeout = null;

  const updateVh = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  const fetchShowList = () => {
    if (typeof Storage !== 'undefined') {
      const randomEpShows = localStorage.getItem(SHOW_LIST_STORAGE);
      if (randomEpShows) {
        setShowList(JSON.parse(randomEpShows));
      } else {
        setShowList(shows);
      }
    }
  };

  const updateShowList = ({ id, name }) => {
    if (showList.filter(show => show.id === id).length === 0) {
      const updatedShowList = [...showList];
      updatedShowList.unshift({ name, id });
      if (updatedShowList.length > SHOW_LIST_LENGTH_CAP) {
        updatedShowList.length = SHOW_LIST_LENGTH_CAP;
      }
      setShowList(updatedShowList);
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(
          SHOW_LIST_STORAGE,
          JSON.stringify(updatedShowList)
        );
      }
    }
  };

  const forgetShowList = () => {
    setShowList([]);
    if (typeof Storage !== 'undefined') {
      localStorage.setItem(SHOW_LIST_STORAGE, JSON.stringify([]));
    }
  };

  const pickRandomEp = showInfo => {
    const season = chooseRandomArrayItem(showInfo.seasons);
    const randomSeason = season.season_number;
    if (randomSeason === 0) {
      return pickRandomEp(showInfo);
    }
    const randomEpisode = generateRandomInt(1, season.episode_count);
    return { randomSeason, randomEpisode };
  };

  const fetchRandomEp = ({ showId, showName, showInfo }) => {
    const { randomSeason, randomEpisode } = pickRandomEp(showInfo);
    fetch(
      `https://api.themoviedb.org/3/tv/${showId}/season/${randomSeason}/episode/${randomEpisode}?api_key=${API_KEY}&language=en-US`
    )
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
        setRandomEpisodeDetails(data);
        if (showPickerActive) {
          setShowPickerActive(false);
          resultContainer.current.focus();
          addShowTimeout = setTimeout(() => {
            updateShowList({ id: showId, name: showName });
          }, 400);
        }
      })
      .catch(err => {
        if (err.message === 'UNAUTHORISED') {
          setError('An error has occured, please try again later... ');
        } else {
          setError('An error has occured, please refresh the page... ');
        }
      });
  };

  const changeShow = ({ id, name }) => {
    setShow({ id, name });
    fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
    )
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
        setShowInfo(data);
        fetchRandomEp({ showId: id, showName: name, showInfo: data });
      })
      .catch(err => {
        if (err.message === 'UNAUTHORISED') {
          setError('An error has occured, please try again later... ');
        } else {
          setError('An error has occured, please refresh the page... ');
        }
      });
  };

  useEffect(() => {
    fetchShowList();
    updateVh();
    window.addEventListener('resize', updateVh);
    return () => {
      window.removeEventListener('resize', updateVh);
      if (addShowTimeout) {
        clearTimeout(addShowTimeout);
      }
    };
  }, [addShowTimeout]);

  if (error !== '') {
    return (
      <div className="loading">
        <span>{error}</span>
      </div>
    );
  }
  return (
    <div className="App">
      <div tabIndex={-1} ref={showPickerContainer}>
        <ShowPicker
          active={showPickerActive}
          shows={showList}
          onChangeShow={changeShow}
          forgetShows={forgetShowList}
        />
      </div>
      {showPickerActive === false && (
        <div className="results" tabIndex={-1} ref={resultContainer}>
          <div className="toolbar">
            <button
              onClick={() => {
                setShow({ id: 0, name: '' });
                setShowInfo({});
                setRandomEpisodeDetails(null);
                setShowPickerActive(true);
                showPickerContainer.current.focus();
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
                fetchRandomEp({ showId: show.id, showInfo });
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
            showName={show.name}
            episodeDetails={randomEpisodeDetails}
          />
        </div>
      )}
      <Credit visible={!showPickerActive} />
    </div>
  );
}
