import React, { Component } from 'react';

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.pickRandomEp = this.pickRandomEp.bind(this);
  }

  state = {
    showId: 4586,
    //showId: 105,
    loaded: false,
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
      this.setState({ randomEpisodeDetails: data, loaded: true});
    });
  }

  componentDidMount() {
    this.fetchData();
  }


  render() {
    if(this.state.loaded) {
      return (
        <div className="App">
          <div>
            <span>Season {this.state.randomEpisodeDetails.season_number}</span>
            <span> Episode {this.state.randomEpisodeDetails.episode_number}</span>
          </div>
          <div>{this.state.randomEpisodeDetails.name}</div>
          <div>{this.state.randomEpisodeDetails.overview}</div>
          <button onClick={this.pickRandomEp}>Give me another</button>
        </div>
      );
    }
    return(
      <div>... nothing yet</div>
    )
  }
}

export default App;
