import React from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'

export default function InputRegion(props) {
    const
        containerClasses = ['input-container']
            .concat(props.prepend ? 'prepend-container' : null)
            .join(' ').trim(),
        fieldClasses = [props.inputClass ? props.inputClass : 'form-control']
            .concat(props.isError ? (props.inputErrorClass ? props.inputErrorClass : 'is-invalid') : null)
            .join(' ').trim(),
        feedbackClasses = ['feedback']
            .concat(props.feedbackClass ? props.feedbackClass : null)
            .join(' ').trim(),
        ErrorComponent = props.errorMsg
            ?
            (<ErrorMessage
                name={props.name}
                render={msg => (<div className={feedbackClasses} style={{display: "block"}}>{msg}</div>)}
            />)
            :
            (<ErrorMessage name={props.name} component="div" className={feedbackClasses}/>)

    return (
        <div className={containerClasses}>
            {
                props.prepend &&
                <label htmlFor={props.id}>
                    <div className="input-label">
                        {props.prepend}
                    </div>
                </label>
            }
            <div className="input-edit">
                {
                    (props.type === 'checkbox')
                        ?
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
                        :
                        <Field
                            id={props.id}
                            name={props.name}
                            type={props.type}
                            value={props.value}
                            className={fieldClasses}
                            autoComplete="off"
                        />
                }
            </div>
            {ErrorComponent}
        </div>
    )
}