import { Field } from 'formik';

import React, { useEffect, useState } from 'react';

import { IRace } from '../../types/profile';

type IRaceSelectorProps = {
  id: string;
  prepend?: string;
  setFieldValue: (field: string, value: IRace) => void;
  field: string;
  racePersisted: IRace;
  isError: boolean; // unused?
};
const raceList: IRace[] = ['terran', 'protoss', 'zerg', 'random'];

const RaceSelector = (props: IRaceSelectorProps) => {
  const [race, setRace] = useState(props.racePersisted);
  const containerClasses = ['input-container']
    .concat(props.prepend ? 'prepend-container' : '')
    .concat('race-pick-container')
    .join(' ')
    .trim();

  const makeSetter = (race: IRace) => () => {
    setRace(race);
    props.setFieldValue(props.field, race);
  };
  const [setTerran, setProtoss, setZerg, setRandom] = raceList.map(makeSetter);

  useEffect(() => {
    if (props.racePersisted !== race) setRace(props.racePersisted);
  }, [props]);

  return (
    <div className={containerClasses}>
      {props.prepend && (
        <label htmlFor={props.id}>
          <div className="input-label">{props.prepend}</div>
        </label>
      )}
      <Field
        id={props.id}
        name={props.field}
        type="text"
        value={race}
        className="displayNone"
        autoComplete="off"
      />
      <div className="input-edit race-pick clearfix">
        <div
          className={
            race === 'terran' ? 'active race-terran-big' : 'race-terran-big'
          }
          onClick={setTerran}
        />
        <div
          className={race === 'zerg' ? 'active race-zerg-big' : 'race-zerg-big'}
          onClick={setZerg}
        />
        <div
          className={
            race === 'protoss' ? 'active race-protoss-big' : 'race-protoss-big'
          }
          onClick={setProtoss}
        />
        <div
          className={
            race === 'random' ? 'active race-random-big' : 'race-random-big'
          }
          onClick={setRandom}
        />
      </div>
    </div>
  );
};

export default RaceSelector;
