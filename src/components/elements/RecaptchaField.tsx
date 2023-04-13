import { ErrorMessage, Field } from 'formik';

import { useState } from 'react';

import ReCAPTCHA from 'react-google-recaptcha';

import * as config from '../../config';

type IRecaptchaFieldProps = {
  id: string;
  value: string;
  name: string;
  setFieldValue: (field: string, value: string) => void;
  feedbackClass?: string;
  errorMsg?: string;
};
const RecaptchaField = (props: IRecaptchaFieldProps) => {
  const [value, setValue] = useState(props.value);
  const containerClasses = ['input-container']
    .concat('grecaptcha-container')
    .join(' ')
    .trim();
  const recaptchaHandle = (key) => {
    //setValue(key)
    props.setFieldValue(props.name, key);
  };
  const feedbackClasses = ['feedback']
    .concat(props.feedbackClass ?? '')
    .join(' ')
    .trim();
  const ErrorComponent = props.errorMsg ? (
    <ErrorMessage
      name={props.name}
      render={(msg) => (
        <div className={feedbackClasses} style={{ display: 'block' }}>
          {msg}
        </div>
      )}
    />
  ) : (
    <ErrorMessage
      name={props.name}
      component="div"
      className={feedbackClasses}
    />
  );

  return (
    <div className={containerClasses}>
      <ReCAPTCHA
        sitekey={config.grecaptchaKey}
        onChange={recaptchaHandle}
        theme="dark"
      />
      <Field
        id={props.id}
        name={props.name}
        type="text"
        value={value}
        className="displayNone"
        autoComplete="off"
      />
      {ErrorComponent}
    </div>
  );
};

export default RecaptchaField;
