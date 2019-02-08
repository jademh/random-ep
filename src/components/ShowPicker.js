import React from 'react';
import { chooseRandomArrayItem } from '../helpers';
import trackEvent from '../tracking';
import '../styles/show-picker.scss';

export default function ShowPicker(props) {
  const { active, shows, onChangeShow } = props;
  return (
    <section className={`showPicker ${active ? 'st-active' : ''}`}>
      <div className="showPicker_panel">
        <h1>Random Episode</h1>
        <div className="showPicker_list">
          {shows.map(show => {
            return (
              <button
                key={show.id}
                value={show.id}
                onClick={() => {
                  onChangeShow(show.id);
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
              onChangeShow(randomShow.id);
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
