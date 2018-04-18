/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { ResourceTypeShape } from '../../../shapes';
import Accordion from '../../../components/Accordion';
import ResourceItem from './ResourceItem';

class ResourceGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayResource: false,
    };
  }

  render() {
    const { icon, topicResource } = this.props;

    return (
      <Accordion
        handleToggle={() =>
          this.setState(prevState => ({
            displayResource: !prevState.displayResource,
          }))
        }
        resourceGroup
        header={topicResource.name}
        hidden={this.state.displayResource}>
        <ResourceItem resources={topicResource.resources} {...{ icon }} />
      </Accordion>
    );
  }
}

ResourceGroup.propTypes = {
  icon: PropTypes.node.isRequired,
  topicResource: ResourceTypeShape,
};

export default injectT(ResourceGroup);
