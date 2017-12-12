/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import Accordion from '../../../components/Accordion';
import {validateDraft} from '../../../modules/draft/draftApi';


const statuses = [
  { key: 'CREATED', label:'Opprettet' },
  { key: 'IMPORTED', label:'Fra spoling' },
  { key: 'DRAFT', label:'Utkast' },
  { key: 'QUEUED_FOR_PUBLISHING', label:'Kvalitetsikret/Til publisering' },
  { key: 'PUBLISHED', label:'Publisert' },
  { key: 'AWAITING_QUALITY_ASSURANCE', label: "Til kvalitetsikring"}
]

// CREATED,IMPORTED,DRAFT,SKETCH,USER_TEST,QUALITY_ASSURED,AWAITING_QUALITY_ASSURANCE


class LearningResourceWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenWorkflow: true,
    };
    this.toggleWorkflow = this.toggleWorkflow.bind(this);
    this.onValidateClick = this.onValidateClick.bind(this);
  }

  onValidateClick() {
    const { model: {id}} = this.props;
    console.log(id)
    validateDraft(id).then((res) => {
      console.log("res", res);
    });
  }

  toggleWorkflow() {
    this.setState(prevState => ({
      hiddenWorkflow: !prevState.hiddenWorkflow,
    }));
  }


  render() {
    const { t } = this.props;
    return (
      <Accordion
        fill
        handleToggle={this.toggleWorkflow}
        header={t('form.workflowSection')}
        hidden={this.state.hiddenWorkflow}>
        <label>Status</label>
        <div className="status" />
        <label>Handlinger</label>

        <Button onClick={this.onValidateClick}>
          Validate article
        </Button>
      </Accordion>
    );
  }
}

LearningResourceWorkflow.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
};

export default injectT(LearningResourceWorkflow);
