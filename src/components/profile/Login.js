import React, {useState} from "react"
import * as Yup from 'yup'
import {Formik, Field, Form, ErrorMessage, setFieldError} from 'formik'
import Cookies from 'universal-cookie'
import {addDays} from 'date-fns'
import {Redirect} from "react-router-dom"
//import ru from "date-fns/locale/ru"

import {Link} from "react-router-dom"
import InputRegion from './../elements/InputRegion'

import * as config from "./../../config"

export default function Login(props) {
    const
        [busy, setBusy] = React.useState(false),
        [message, setMessage] = React.useState(config.messages[1]),
        formInitialValues = {
            login: '',
            password: '',
            rememberMe: false,
        },
        formSchema = Yup.object().shape({
            login: Yup.string()
                .required('Login required')
                .max(64, '64 symbols max'),
            password: Yup.string()
                .required('Password required')
                .min(4, '4 symbols min').max(64, '64 symbols max'),
            rememberMe: Yup.boolean(),
        })

    const
        goLogin = (formValues, e) => {
            const
                cookies = new Cookies(),
                now = new Date(),
                expires = addDays(now, config.cookieExpires),
                cookieOptions = formValues.rememberMe
                    ? {expires: expires, path: '/'}
                    : {path: '/'}
            setBusy(true)
            setMessage('...')
            fetch(config.api('token'), {
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
                        setMessage(config.messages[0]);
                        cookies.set('DefilerAuthKey', data.token, cookieOptions)
                        props.handler()
                    } else {
                        setBusy(false)
                        setMessage(config.messages[4] + data.message);
                    }
                })
                .catch((e) => {
                    setBusy(false)
                    setMessage(config.messages[2]);
                    console.log(e)
                });
        }

    if (props.auth) return (<Redirect push to="/logout"/>)

    return (
        <Formik
            initialValues={formInitialValues}
            validationSchema={formSchema}
            onSubmit={goLogin}
        >
            {({errors, status, touched, values}) => (
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
                        id="rememberMe"
                        prepend="remember:"
                        name="rememberMe"
                        type="checkbox"
                        checked={values.rememberMe || false}
                        isError={errors.rememberMe && touched.rememberMe}
                    />
                    <button type="submit" disabled={busy} className="btn form-control">Login</button>
                    <Link to="/register">
                        <button type="button" className="btn form-control">
                            Registration
                        </button>
                    </Link>
                </Form>
            )}
        </Formik>
    )
}