import React, { PureComponent } from 'react';
import ConceptForm from './ConceptForm';

class CreateConcept extends PureComponent {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ConceptForm {...this.props} concept={{ language: 'nb' }} />
      </div>
    );
  }
}

export default CreateConcept;
