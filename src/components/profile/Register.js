import React, {useState, useEffect} from "react"
import * as Yup from 'yup'
import {Formik, Field, Form, ErrorMessage, setFieldError} from 'formik'
import Cookies from 'universal-cookie'
import {Link, Navigate} from "react-router-dom"

import * as config from "../../config"

import InputRegion from './../elements/InputRegion'
import RaceSelector from "../elements/RaceSelector";
import RecaptchaField from "../elements/RecaptchaField";

export default function Register(props) {
    const
        [busy, setBusy] = React.useState(false),
        [message, setMessage] = React.useState(config.messages[11]),
        goRegister = (formValues, setFieldValue) => {
            console.log(formValues)
            const
                cookies = new Cookies(),
                cookieOptions = {path: '/'}
            setBusy(true)
            setMessage('...')
            fetch(config.api('register'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setBusy(false)
                        setMessage('registered')
                        cookies.set('DefilerAuthKey', data.token, cookieOptions)
                        props.handler()
                    } else {
                        setBusy(false)
                        setMessage(data.message)
                    }
                    window.grecaptcha.reset()
                    setFieldValue('recaptcha', '')
                })
                .catch((e) => {
                    setBusy(false)
                    setMessage(config.messages[2]);
                    console.log(e)
                });
        },
        formInitialValues = {
            login: '',
            password: '',
            email: '',
            race: 'none',
            recaptcha: '',
        },
        formSchema = Yup.object().shape({
            login: Yup.string()
                .required('Login')
                .min(5, '5 symbols min')
                .max(64, '20 symbols max'),
            password: Yup.string()
                .required('Password')
                .min(6, '6 symbols min')
                .max(64, '32 symbols max'),
            email: Yup.string()
                .email('Wrong email')
                .max(64, '64 symbols max'),
            race: Yup.string()
                .oneOf(['zerg', 'terran', 'protoss', 'random', 'none'], 'SC:BW race'),
            recaptcha: Yup.string().
                required('Click checkbox'),
        })


    if (props.auth) return (<Navigate push to="/profile"/>)

    return (
        <Formik
            initialValues={formInitialValues}
            validationSchema={formSchema}
            onSubmit={(values, {setFieldValue}) => { goRegister(values, setFieldValue) }}
        >
            {({errors, status, touched, values, setFieldValue}) => (
                <Form>
                    <div className="advisor">
                        <div className="icon"></div>
                        <div className="message form-control">{message}</div>
                    </div>
                    <InputRegion
                        id="login"
                        prepend="login:"
                        name="login"
                        type="text"
                        value={values.login || ''}
                        isError={errors.login && touched.login}
                    />
                    <InputRegion
                        id="password"
                        prepend="password:"
                        name="password"
                        type="password"
                        value={values.password || ''}
                        isError={errors.password && touched.password}
                    />
                    <InputRegion
                        id="email"
                        prepend="email:"
                        name="email"
                        type="email"
                        value={values.email || ''}
                        isError={errors.email && touched.email}
                    />
                    <RaceSelector
                        id="race"
                        prepend="race:"
                        name="race"
                        value={values.race || ''}
                        setFieldValue={setFieldValue}
                        isError={errors.race && touched.race}
                    />
                    <RecaptchaField
                        id="recaptcha"
                        name="recaptcha"
                        value={values.recaptcha || ''}
                        setFieldValue={setFieldValue}
                    />
                    <div className="divider"/>
                    <button type="submit" disabled={busy} className="btn form-control">
                        Registration
                    </button>
                    <Link to="/login">
                        <button type="button" className="btn form-control">
                            Login
                        </button>
                    </Link>
                </Form>
            )}
        </Formik>
    )
}