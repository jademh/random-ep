import React, { Component } from 'react';

import shows from './shows';
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
    showId: 0,
    showName: '',
    seasons: [],
    seasonCount: 0,
    episodeCount: 0,
    randomEpisodeDetails: null,
  }

  fetchData() {
    const fetchPath = `https://api.themoviedb.org/3/tv/${this.state.showId}?api_key=${API_KEY}&language=en-US`;
    fetch(fetchPath)
    .then(response => response.json())
    .then(data => {
      this.setState({
        seasons: data.seasons,
        showName: data.name,
        seasonCount: data.seasons.length,
        episodeCount: data.number_of_episodes,
      }, this.pickRandomEp);
    });
  }

  pickRandomEp() {
    const randomSeason = Math.floor(Math.random() * (this.state.seasonCount));
    const epsInRandomSeason = this.state.seasons[randomSeason].episode_count;
    const randomEpisode = Math.floor(Math.random() * epsInRandomSeason) + 1;
    const fetchPath = `https://api.themoviedb.org/3/tv/${this.state.showId}/season/${randomSeason}/episode/${randomEpisode}?api_key=${API_KEY}&language=en-US`;
    fetch(fetchPath)
    .then(response => response.json())
    .then(data => {
      if(data.season_number !== 0) {
        this.setState({ randomEpisodeDetails: data, loaded: true});
      }
      else {
        this.pickRandomEp();
      }
    });
  }

  changeShow(evt) {
    this.setState({showId: evt.target.value}, this.fetchData);
  }

  componentDidMount() {
    const randomShow = Math.floor(Math.random() * shows.length);
    this.setState({showId: shows[randomShow].id}, this.fetchData)
  }

  render() {
    if(this.state.loaded) {
      return (
        <div className="App">
          <ul className="showPicker">
            {shows.map((show) => {
              return (
                <button key={show.id} value={show.id} disabled={this.state.showId == show.id} onClick={this.changeShow}>{show.name}</button>
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
    return(
      <div className="loading"><span>... Loading</span></div>
    )
  }
}

export default App;
