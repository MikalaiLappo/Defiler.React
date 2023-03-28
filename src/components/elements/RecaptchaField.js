import React, {useState, useRef, useEffect} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import ReCAPTCHA from "react-google-recaptcha"
import * as config from "../../config";

export default function RecaptchaField(props) {
    const
        [value, setValue] = React.useState(props.value),
        containerClasses = ['input-container']
            .concat('grecaptcha-container')
            .join(' ').trim(),
        recaptchaHandle = (key) => {
            //setValue(key)
            props.setFieldValue(props.name, key)
        },
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
            <ReCAPTCHA
                sitekey={config.grecaptchaKey}
                onChange={recaptchaHandle}
                theme='dark'
            />
            <Field
                id={props.id}
                name={props.name}
                type='text'
                value={value}
                className='displayNone'
                autoComplete="off"
            />
            {ErrorComponent}
        </div>
    )
}