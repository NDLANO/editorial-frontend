/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import AddTopicResourceButton from './AddTopicResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { FilterShape } from '../../../shapes';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';

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
    this.handleToggle = this.handleToggle.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
  }

  handleToggle() {
    this.setState(prevState => ({
      displayResource: !prevState.displayResource,
    }));
  }

  toggleAddModal() {
    this.setState(prevState => ({ showAddModal: !prevState.showAddModal }));
  }

  render() {
    const {
      resource,
      topicResource,
      t,
      params,
      refreshResources,
      activeFilter,
      locale,
      currentTopic,
      currentSubject,
    } = this.props;
    const topicId = params.subtopics?.split('/')?.pop() || params.topic;
    return (
      <React.Fragment>
        <Accordion
          addButton={
            <AddTopicResourceButton
              stripped
              onClick={this.toggleAddModal}
              disabled={resource.disabled}>
              <Plus />
              {t('taxonomy.addResource')}
            </AddTopicResourceButton>
          }
          handleToggle={this.handleToggle}
          appearance="resourceGroup"
          header={resource.name}
          hidden={topicResource.resources ? this.state.displayResource : true}>
          {topicResource.resources && (
            <ResourceItems
              resources={topicResource.resources}
              contentType={topicResource.contentType}
              refreshResources={refreshResources}
              activeFilter={activeFilter}
              locale={locale}
              currentTopic={currentTopic}
              currentSubject={currentSubject}
            />
          )}
        </Accordion>
        {this.state.showAddModal && (
          <AddResourceModal
            topicFilters={currentTopic.filters}
            type={resource.id}
            allowPaste={resource.id !== RESOURCE_TYPE_LEARNING_PATH}
            topicId={topicId}
            refreshResources={refreshResources}
            onClose={this.toggleAddModal}
          />
        )}
      </React.Fragment>
    );
  }
}

ResourceGroup.propTypes = {
  topicResource: PropTypes.shape({
    resources: PropTypes.array,
    contentType: PropTypes.string,
  }),
  resource: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  params: PropTypes.shape({
    topic: PropTypes.string,
    subtopics: PropTypes.string,
  }),
  refreshResources: PropTypes.func,
  activeFilter: PropTypes.string,
  locale: PropTypes.string,
  currentTopic: PropTypes.shape({
    filters: PropTypes.arrayOf(FilterShape),
  }),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default injectT(ResourceGroup);
