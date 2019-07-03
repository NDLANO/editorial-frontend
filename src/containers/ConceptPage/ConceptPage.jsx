import React, { PureComponent } from 'react';
import { injectT } from '@ndla/i18n';
import * as conceptApi from '../../../src/modules/concept/conceptApi';
import handleError from '../../util/handleError';


class ConceptPage extends PureComponent{

    state = {
        concept: undefined,
    };

    async componentDidMount(){
        try {
            const fetchedConcept = await fetchFilmFrontpage();
        }
        catch(err){
            handleError(err);
        }


    }
    

    render() {        
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Concept2</h1>
          searchConcepts(1, )
          </div>
        );
      }
}

export default ConceptPage;