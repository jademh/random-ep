import React from 'react';
import dietaryRequirements from '../data/dietaryRequirements';

export default function DietaryRequirements(props) {
  const { onChangeDietaryRequirements } = props;
  return (
    <div>
      {dietaryRequirements.map(item => {
        return (
          <div key={item.key}>
            <label>
              <input
                type="checkbox"
                value={item.key}
                onChange={onChangeDietaryRequirements}
                checked={props.dietaryRequirements[item.key]}
              />
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}
