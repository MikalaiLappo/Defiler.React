import { ErrorMessage, Field, Form, Formik } from 'formik';

import React, { useEffect, useRef, useState } from 'react';

export default function RaceSelector(props) {
  const [value, setValue] = React.useState(props.value),
    containerClasses = ['input-container']
      .concat(props.prepend ? 'prepend-container' : null)
      .concat('race-pick-container')
      .join(' ')
      .trim(),
    setTerran = () => {
      setValue('terran');
      props.setFieldValue(props.name, 'terran');
    },
    setZerg = () => {
      setValue('zerg');
      props.setFieldValue(props.name, 'zerg');
    },
    setProtoss = () => {
      setValue('protoss');
      props.setFieldValue(props.name, 'protoss');
    },
    setRandom = () => {
      setValue('random');
      props.setFieldValue(props.name, 'random');
    };

  useEffect(() => {
    if (props.value !== value) setValue(props.value);
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
        name={props.name}
        type="text"
        value={value}
        className="displayNone"
        autoComplete="off"
      />
      <div className="input-edit race-pick clearfix">
        <div
          className={
            value === 'terran' ? 'active race-terran-big' : 'race-terran-big'
          }
          onClick={setTerran}
        />
        <div
          className={
            value === 'zerg' ? 'active race-zerg-big' : 'race-zerg-big'
          }
          onClick={setZerg}
        />
        <div
          className={
            value === 'protoss' ? 'active race-protoss-big' : 'race-protoss-big'
          }
          onClick={setProtoss}
        />
        <div
          className={
            value === 'random' ? 'active race-random-big' : 'race-random-big'
          }
          onClick={setRandom}
        />
      </div>
    </div>
  );
}
