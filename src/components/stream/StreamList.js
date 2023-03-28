import React, {useState, useEffect, useRef} from "react"
import {Link} from "react-router-dom"
import {useParams} from "react-router-dom"

export default function StreamList(props) {
    const
        sortedList = props.streams.sort((a, b) => {
            const typeIndex = (type) => {
                return ['defiler', 'progamer', 'other', 'heresy'].findIndex((x) => x === type)
            }
            const
                ta = typeIndex(a.type),
                tb = typeIndex(b.type)
            if (ta === tb) return b.fame - a.fame
            return ta - tb;
        }),
        streamList = sortedList.map((stream, index) => {
            const
                styles = stream.pic
                    ? {
                        backgroundImage: `url('/images/pic/${stream.pic}.png')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }
                    : {}
            return (
                <Link to={"/stream/" + stream.id} key={index}>
                    <div className={`stream-block ${props.currentStream.id === stream.id ? 'chosen' : null}`}>
                        <div
                            className={`stream-icon ${stream.pic}`}
                            style={styles}
                        >&nbsp;</div>
                        <div className={`stream-race ${stream.race}`}>&nbsp;</div>
                        {stream.name}
                    </div>
                </Link>
            )
        })

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useInterval(() => {
            props.refreshData('streams', 'online')
        }, 60000
    )

    useEffect(() => {
    }, [])

    return (
        <>
            <div className="stream-list-header"></div>
            {streamList}
            <div className="stream-list-footer"></div>
        </>
    )
}