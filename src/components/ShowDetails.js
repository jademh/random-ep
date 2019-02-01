import React from 'react';

export default function ShowDetails(props) {
  const { showName, episodeDetails } = props;
  const { name, season_number, episode_number, overview } = episodeDetails;
  return (
    <div className="showDetails">
      <h1>{showName}</h1>
      <h2 className="showDetails_name">{name}</h2>
      <h3 className="showDetails_season">Season {season_number}</h3>
      <h4 className="showDetails_episode">Episode {episode_number}</h4>
      <div className="showDetails_overview">
        <p>{overview}</p>
      </div>
    </div>
  );
}
