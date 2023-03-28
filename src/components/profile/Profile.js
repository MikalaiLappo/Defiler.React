import React, {useState, useEffect} from "react"
import * as Yup from 'yup'
import {Formik, Field, Form, ErrorMessage, setFieldError} from 'formik'
import Cookies from 'universal-cookie'
import {Link, Redirect} from "react-router-dom"

import * as config from "../../config"

import InputRegion from './../elements/InputRegion'
import RaceSelector from './../elements/RaceSelector'

export default function Profile(props) {
    const
        [busy, setBusy] = React.useState(true),
        [talking, setTalking] = React.useState(-1),
        [message, setMessage] = React.useState(config.messages[5]),
        formInitialValues = {
            aka: '',
            email: '',
            race: 'none',
        },
        [profileValues, setProfileValues] = React.useState(formInitialValues),
        formSchema = Yup.object().shape({
            aka: Yup.string()
                .min(3, '3 symbols min').max(64, '64 symbols max'),
            email: Yup.string()
                .email('Wrong email')
                .max(64, '64 symbols max'),
            race: Yup.string()
                .oneOf(['zerg', 'terran', 'protoss', 'random', 'none'], 'SC:BW race'),
        }),
        talk = (i) => {
            config.talk(i, 0, setMessage, setTalking, talking)
        },
        goUpdate = (formValues) => {
            config.abort()
            setMessage('...')
            setBusy(true)
            formValues.auth = props.auth
            fetch(config.api('save'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues)
            })
                .then(response => response.json())
                .then(data => {
                    setBusy(false)
                    if (data.success) {
                        talk(10)
                        props.handler()
                    } else {
                        setMessage(data.message);
                    }
                })
                .catch((e) => {
                    setBusy(false)
                    setMessage(config.messages[2]);
                    console.log(e)
                });
        },
        goLogout = () => {
            setBusy(true)
            const
                cookies = new Cookies()
            setMessage(config.messages[3])
            cookies.remove('DefilerAuthKey')
            setBusy(false)
            props.handler()
        }

    // ComponentWillUnmount
    useEffect(() => {
        // Get Profile Data
        fetch(config.api('profile'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({auth: props.auth})
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setBusy(false)
                    setProfileValues(data.data);
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

        //stop talking
        return () => config.abort()
    }, [])

    if (!props.auth) return (<Redirect push to="/login"/>)

    return (
        <Formik
            //initialValues={formInitialValues}
            initialValues={profileValues}
            enableReinitialize={true}
            validationSchema={formSchema}
            onSubmit={goUpdate}
        >
            {({errors, status, touched, values, setFieldValue}) => (
                <Form>
                    <div className="advisor">
                        <div className="icon"></div>
                        <div className="message form-control">{message}</div>
                    </div>
                    <Link to="/messages">
                        <button type="button" className="btn form-control" onMouseOver={() => talk(6)}>
                            Messages
                        </button>
                    </Link>
                    <Link to="/streams">
                        <button type="button" className="btn form-control" onMouseOver={() => talk(6)}>
                            Streams
                        </button>
                    </Link>
                    <Link to="/password">
                        <button type="button" className="btn form-control" onMouseOver={() => talk(9)}>Password</button>
                    </Link>
                    <button type="button" onClick={goLogout} disabled={busy} className="btn form-control"
                            onMouseOver={() => talk(3)}>
                        Logout
                    </button>
                    <button type="button" className="btn form-control" onClick={() => talk(8)}>Talk</button>
                    <div className="divider"/>
                    <InputRegion
                        id="aka"
                        prepend="aka:"
                        name="aka"
                        type="text"
                        value={values.aka || ''}
                        isError={errors.aka && touched.aka}
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
                    <div className="divider"/>
                    <button type="submit" disabled={busy} className="btn form-control" onMouseOver={() => talk(7)}>
                        Save
                    </button>
                </Form>
            )}
        </Formik>
    )
}