/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Plus } from 'ndla-icons/action';
import BEMHelper from 'react-bem-helper';

import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});
class ResourceGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayResource: false,
      showAddModal: false,
    };
  }

  render() {
    const { resource, topicResource, t, params, refreshResources } = this.props;

    return (
      <React.Fragment>
        <Accordion
          addButton={
            <Button
              {...classes('addButton')}
              stripped
              onClick={() => this.setState({ showAddModal: true })}>
              {<Plus />}
              {t('taxonomy.addResource')}
            </Button>
          }
          handleToggle={() =>
            this.setState(prevState => ({
              displayResource: !prevState.displayResource,
            }))
          }
          resourceGroup
          header={resource.name}
          hidden={topicResource.resources ? this.state.displayResource : true}>
          {topicResource.resources && (
            <ResourceItems
              resources={topicResource.resources}
              contentType={topicResource.contentType}
              refreshResources={refreshResources}
            />
          )}
        </Accordion>
        {this.state.showAddModal && (
          <AddResourceModal
            type={resource.id}
            topicId={params.topic3 || params.topic2 || params.topic1}
            refreshResources={refreshResources}
            onClose={() => this.setState({ showAddModal: false })}
          />
        )}
      </React.Fragment>
    );
  }
}

ResourceGroup.propTypes = {
  topicResource: PropTypes.shape({
    resources: PropTypes.array,
  }),
  resource: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  params: PropTypes.shape({
    topic1: PropTypes.string,
    topic2: PropTypes.string,
  }),
  refreshResources: PropTypes.func,
};

export default injectT(ResourceGroup);
