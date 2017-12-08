/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import Accordion from '../../../components/Accordion';

class LearningResourceMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenMetadata: true,
    };
    this.toggleWorkflow = this.toggleWorkflow.bind(this);
  }

  toggleWorkflow() {
    this.setState(prevState => ({
      hiddenWorkflow: !prevState.hiddenMetadata,
    }));
  }

  render() {
    const { t, } = this.props;

    return (
      <Accordion
        fill
        handleToggle={this.toggleWorkflow}
        header={t('form.workflowSection')}
        hidden={this.state.hiddenMetadata}>
        <Button>
          Validate article
        </Button>
      </Accordion>
    );
  }
}

export default injectT(LearningResourceMetadata);
