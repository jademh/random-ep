import React, { Component } from 'react';

import shows from './shows';
import { generateRandomInt, chooseRandomArrayItem } from './helpers';

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.pickRandomEp = this.pickRandomEp.bind(this);
    this.changeShow = this.changeShow.bind(this);
  }

  state = {
    loaded: false,
    error: '',
    showId: 0,
    showName: '',
    seasons: [],
    randomEpisodeDetails: null,
  }

  fetchData() {
    const { showId } = this.state;
    const fetchPath = `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&language=en-US`;
    fetch(fetchPath)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      if(response.status === 401) {
        throw new Error('UNAUTHORISED');
      }
      throw new Error('Request Failed');
    })
    .then(data => {
      this.setState({
        seasons: data.seasons,
        showName: data.name,
      }, this.pickRandomEp);
    })
    .catch(err => {
      if(err.message === 'UNAUTHORISED') {
        this.setState({ error: "An error has occured, please try again later... " });
      }
      this.setState({ error: "An error has occured, please refresh the page... " })
    });
  }

  pickRandomEp() {
    const { showId, seasons} = this.state;
    const randomSeason = chooseRandomArrayItem(seasons);
    console.log(randomSeason);
    const randomEpisode = generateRandomInt(1, randomSeason.episode_count);
    const fetchPath = `https://api.themoviedb.org/3/tv/${showId}/season/${randomSeason.season_number}/episode/${randomEpisode}?api_key=${API_KEY}&language=en-US`;
    fetch(fetchPath)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      if(response.status === 401) {
        throw new Error('UNAUTHORISED');
      }
      throw new Error('Request Failed');
    })
    .then(data => {
      if(data.season_number !== 0) {
        this.setState({ randomEpisodeDetails: data, loaded: true});
      }
      else {
        throw new Error('Season Zero Error');
      }
    })
    .catch(err => {
      if(err.message === 'UNAUTHORISED') {
        this.setState({ error: "An error has occured, please try again later... " })
      }
      else {
        // Pick another random episode
        this.pickRandomEp();
      }
    });
  }

  changeShow(evt) {
    this.setState({showId: parseInt(evt.target.value)}, this.fetchData);
  }

  componentDidMount() {
    const randomShow = chooseRandomArrayItem(shows);
    this.setState({
      showId: randomShow.id
    }, this.fetchData);
  }

  render() {
    if(this.state.loaded) {
      return (
        <div className="App">
          <ul className="showPicker">
            {shows.map((show) => {
              return (
                <button key={show.id} value={show.id} disabled={this.state.showId === show.id} onClick={this.changeShow}>{show.name}</button>
              )
            })}
          </ul>
          <div className="showDetails">
            <h1>{this.state.showName}</h1>
            <h2 className="showDetails_name">{this.state.randomEpisodeDetails.name}</h2>
            <h3 className="showDetails_season">Season {this.state.randomEpisodeDetails.season_number}</h3>
            <h4 className="showDetails_episode">Episode {this.state.randomEpisodeDetails.episode_number}</h4>
            <button className="refreshEp" onClick={this.pickRandomEp}>Give me another ep</button>
            <div className="showDetails_overview">
              <p>{this.state.randomEpisodeDetails.overview}</p>
            </div>
          </div>
        </div>
      );
    }
    if(this.state.error !== '') {
      return (
        <div className="loading"><span>{this.state.error}</span></div>
      )
    }
    return(
      <div className="loading"><span>... Loading</span></div>
    )
  }
}

export default App;
