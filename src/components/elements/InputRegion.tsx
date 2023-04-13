import { ErrorMessage, Field } from 'formik';

type IInputRegionProps = {
  id: string;
  type: string;
  value?: string;
  prepend?: string;
  inputClass?: string;
  isError?: boolean;
  inputErrorClass?: string;
  feedbackClass?: string;
  errorMsg?: string;
  name: string;
  checked?: boolean;
};
const InputRegion = (props: IInputRegionProps) => {
  const containerClasses = ['input-container']
    .concat(props.prepend ? 'prepend-container' : '')
    .join(' ')
    .trim();
  const fieldClasses = [props.inputClass ?? 'form-control']
      .concat(
        props.isError
          ? props.inputErrorClass
            ? props.inputErrorClass
            : 'is-invalid'
          : '',
      )
      .join(' ')
      .trim(),
    feedbackClasses = ['feedback']
      .concat(props.feedbackClass ?? '')
      .join(' ')
      .trim(),
    ErrorComponent = props.errorMsg ? (
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
      {props.prepend && (
        <label htmlFor={props.id}>
          <div className="input-label">{props.prepend}</div>
        </label>
      )}
      <div className="input-edit">
        {props.type === 'checkbox' ? (
          <>
            <Field
              id={props.id}
              name={props.name}
              type={props.type}
              checked={props.value}
              className="switcher"
            />
            <label htmlFor={props.id}> </label>
          </>
        ) : (
          <Field
            id={props.id}
            name={props.name}
            type={props.type}
            value={props.value}
            className={fieldClasses}
            autoComplete="off"
          />
        )}
      </div>
      {ErrorComponent}
    </div>
  );
};

export default InputRegion;
