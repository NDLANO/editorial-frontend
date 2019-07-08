import React, { PureComponent } from 'react';
import Concept from './components/Concept'
import * as conceptApi from "../../modules/concept/conceptApi"

class DisplayConcept extends PureComponent{

state = {
    isLoading: true,
    concepts: []
};

async componentDidMount() {
    try {
        
        //console.log(await conceptApi.fetchAllConcepts('nb'));
        const fetchedConcepts = await conceptApi.fetchAllConcepts('nb')
        console.log(fetchedConcepts)
        this.setState({
        concepts : fetchedConcepts.results,
        isLoading: false,
        })
    } catch (err) {
        handleError(err);
    }
}

render() {
    const {isLoading, concepts} = this.state
    console.log(isLoading, concepts);
    return (
        <>
            {!isLoading ? (
                concepts.map(concept2 => (
                    <Concept key={concept2.id} concept={concept2}/>
                ))
                ): console.log("Something failed")
            }
        </>
    );
    }
}

  export default DisplayConcept

  