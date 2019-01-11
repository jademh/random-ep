import React from 'react'
import { chooseRandomArrayItem } from '../helpers';

export default function ShowPicker(props) {
  const { active, shows, onChangeShow } = props;
  return (
    <section className={`showPicker ${active ? 'st-active': ''}`}>
      <div className="showPicker_panel">
        <h1>Random Ep Generator</h1>
        <h2>Pick a show...</h2>
        <div className="showPicker_list">
            {shows.map((show) => {
              return (
                <button key={show.id} value={show.id} onClick={() => onChangeShow(show.id)}>{show.name}</button>
              )
            })}
            <button onClick={() => onChangeShow(chooseRandomArrayItem(shows).id)}>🔮 Surprise Me 🔮</button>
          </div>
        </div>
    </section>
  )
}
