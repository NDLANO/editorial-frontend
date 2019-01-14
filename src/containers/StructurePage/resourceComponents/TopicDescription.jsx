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
  }

  toggleAddModal() {
    this.setState(prevState => ({
      showAddModal: !prevState.showAddModal,
    }));
  }

  render() {
    const {
      topicDescription,
      locale,
      refreshTopics,
      currentTopic,
      t,
      refFunc,
    } = this.props;
    return (
      <div ref={el => refFunc(el, 'resourceSection')}>
        <Accordion
          appearance="resourceGroup"
          header={t('searchForm.articleType.topicArticle')}
          hidden={!this.state.displayTopicDescription}
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
          handleToggle={() =>
            this.setState(prevState => ({
              displayTopicDescription: !prevState.displayTopicDescription,
            }))
          }>
          {topicDescription && (
            <Resource contentType="subject" name={topicDescription} />
          )}
        </Accordion>
        {this.state.showAddModal && (
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
  refFunc: PropTypes.func,
};

export default injectT(TopicDescription);
