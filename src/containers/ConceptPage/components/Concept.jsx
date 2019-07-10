import React from "react"

const Concept = ({concept}) => {
    console.log("heiq", concept)

    return (
        <div>
            <h1>{concept.title.title}</h1>
            <p>{concept.content.content}</p> 
        </div>
    )
}

export default Concept;