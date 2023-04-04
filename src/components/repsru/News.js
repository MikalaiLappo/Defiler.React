import React from "react"
import {Link, Redirect} from "react-router-dom"

import BBCode from '@bbob/react/es/Component'
import reactPreset from '@bbob/preset-react/es'

export default function RepsruNews(props) {
    if (!props.data) return (<></>);

    const
        newsList = props.data.map((post, index) => {
            return (
                <div className="item" key={index}>
                    <span className="start"> {'>>'} </span>
                    <a href={"https://reps.ru/news/" + post.id} target="_blank">{post.title}</a><br/>
                    <p>
                        <BBCode plugins={[reactPreset()]} options={{ onlyAllowTags: ['i', 'b', 'u', 'url'] }}>
                            {post.previewContent}
                        </BBCode>
                    </p>
                </div>
            )
        })

    return (
        <div className="repsru_news">
            <h4>news.</h4>
            {newsList}
        </div>
    )
}