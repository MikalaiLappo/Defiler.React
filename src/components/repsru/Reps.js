import React from "react"
import {Link, Redirect} from "react-router-dom"

/*
      "id": "5",
      "title": "Jeez Weekly 100 (27.12.2020) full replay pack",
      "firstCountry": "Austria",
      "secondCountry": "African Rep.",
      "firstRace": "Zerg",
      "secondRace": "Terran",
      "map": "null",
      "mapUrl": "storage/images/replays/maps/c43c776d8bb43626270f7f6a0ae405a6.png",
      "mapUrlFull": "https://reps.ru/storage/images/replays/maps/c43c776d8bb43626270f7f6a0ae405a6.png",
      "type": "VOD",
      "status": "Game of the Week",
      "link": "Unknown Type: https://reps.ru/replay/5?type=pro"
*/

export default function RepsruReplays(props) {
    if (!props.data) return (<></>);

    const
        repsList = props.data.map((rep, index) => {
            return (
                <div className="item" key={index}>
                    <span className="start"> {'>>'} </span>
                    <a href={"https://reps.ru/replay/" + rep.id} target="_blank">{rep.title}</a><br/>
                </div>
            )
        })

    return (
        <div className="repsru_replays">
            <h4>replays.</h4>
            {repsList}
        </div>
    )
}