import React from 'react';

let padToTwo = number => (number <= 99 ? `000${number}`.slice(-2) : number);

export default function ShowDetails(props) {
  const { showName, episodeDetails } = props;
  const { name, season_number, episode_number, overview } = episodeDetails;
  return (
    <div className="showDetails">
      <h1>{showName}</h1>
      <h2 className="showDetails_name">{name}</h2>
      <h3 className="showDetails_season">
        S{padToTwo(season_number)} E{padToTwo(episode_number)}
      </h3>
      <div className="showDetails_overview">
        <p>{overview}</p>
      </div>
    </div>
  );
}
