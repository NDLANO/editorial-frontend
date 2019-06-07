import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import config from '../../../config';
import AddTopicResourceButton from './AddTopicResourceButton';

class TopicDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTopicDescription: true,
      showAddModal: false,
    };
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleDisplayTopicDescription = this.toggleDisplayTopicDescription.bind(
      this,
    );
  }

  toggleAddModal() {
    this.setState(prevState => ({
      showAddModal: !prevState.showAddModal,
    }));
  }

  toggleDisplayTopicDescription() {
    this.setState(prevState => ({
      displayTopicDescription: !prevState.displayTopicDescription,
    }));
  }

  render() {
    const {
      topicDescription,
      locale,
      refreshTopics,
      currentTopic,
      t,
      resourceRef,
    } = this.props;

    const { displayTopicDescription, showAddModal } = this.state;

    return (
      <div ref={resourceRef}>
        <Accordion
          appearance="resourceGroup"
          header={t('searchForm.articleType.topicArticle')}
          hidden={!displayTopicDescription}
          addButton={
            config.enableFullTaxonomy && (
              <AddTopicResourceButton
                stripped
                data-testid="changeTopicDescription"
                onClick={this.toggleAddModal}>
                <Plus />
                {t('taxonomy.addTopicDescription')}
              </AddTopicResourceButton>
            )
          }
          handleToggle={this.toggleDisplayTopicDescription}>
          {topicDescription && (
            <Resource
              contentType="topic-article"
              name={topicDescription}
              locale={locale}
              contentUri={currentTopic.contentUri}
            />
          )}
        </Accordion>
        {showAddModal && (
          <AddArticleModal
            toggleAddModal={this.toggleAddModal}
            locale={locale}
            refreshTopics={refreshTopics}
            currentTopic={currentTopic}
          />
        )}
      </div>
    );
  }
}

TopicDescription.propTypes = {
  topicDescription: PropTypes.string,
  locale: PropTypes.string.isRequired,
  refreshTopics: PropTypes.func,
  currentTopic: PropTypes.shape({
    id: PropTypes.string,
    contentUri: PropTypes.string,
  }).isRequired,
  resourceRef: PropTypes.object,
};

export default injectT(TopicDescription);
