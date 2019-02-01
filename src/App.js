import React, { Component } from 'react';
import ShowPicker from './components/ShowPicker';
import ShowDetails from './components/ShowDetails';
import shows from './shows';
import { generateRandomInt, chooseRandomArrayItem } from './helpers';

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.pickRandomEp = this.pickRandomEp.bind(this);
    this.changeShow = this.changeShow.bind(this);
    this.pickShow = this.pickShow.bind(this);
  }

  state = {
    showChosen: false,
    loaded: false,
    error: '',
    showId: 0,
    showName: '',
    seasons: [],
    randomEpisodeDetails: null,
  };

  fetchData() {
    const { showId } = this.state;
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
        this.setState(
          {
            seasons: data.seasons,
            showName: data.name,
            showChosen: true,
          },
          this.pickRandomEp
        );
      })
      .catch(err => {
        if (err.message === 'UNAUTHORISED') {
          this.setState({
            error: 'An error has occured, please try again later... ',
          });
        }
        this.setState({
          error: 'An error has occured, please refresh the page... ',
        });
      });
  }

  pickRandomEp() {
    const { showId, seasons } = this.state;
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
          this.setState({ randomEpisodeDetails: data, loaded: true });
        } else {
          throw new Error('Season Zero Error');
        }
      })
      .catch(err => {
        if (err.message === 'UNAUTHORISED') {
          this.setState({
            error: 'An error has occured, please try again later... ',
          });
        } else {
          // Pick another random episode
          this.pickRandomEp();
        }
      });
  }

  changeShow(showId) {
    this.setState({ showId }, this.fetchData);
  }

  pickShow() {
    this.setState({ showChosen: false });
  }

  render() {
    if (this.state.error !== '') {
      return (
        <div className="loading">
          <span>{this.state.error}</span>
        </div>
      );
    }
    return (
      <div className="App">
        <ShowPicker
          active={!this.state.showChosen}
          shows={shows}
          onChangeShow={this.changeShow}
        />
        {this.state.loaded && (
          <div className="results">
            <div className="toolbar">
              <button onClick={this.pickShow}>
                <span>Pick a different show </span>
                <span role="img" aria-label="TV emoji">
                  📺
                </span>
              </button>
              <button onClick={this.pickRandomEp}>
                <span>Pick random episode </span>
                <span role="img" aria-label="sparkle emoji">
                  ✨
                </span>
              </button>
            </div>
            <ShowDetails
              showName={this.state.showName}
              episodeDetails={this.state.randomEpisodeDetails}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
