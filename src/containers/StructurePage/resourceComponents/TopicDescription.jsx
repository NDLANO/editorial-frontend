import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { Plus } from '@ndla/icons/action';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import config from '../../../config';

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
    } = this.props;
    return (
      <React.Fragment>
        <Accordion
          resourceGroup
          header={t('searchForm.articleType.topicArticle')}
          hidden={!this.state.displayTopicDescription}
          addButton={
            config.enableFullTaxonomy && (
              <Button
                className="c-topic-resource__add-button"
                stripped
                data-testid="changeTopicDescription"
                onClick={this.toggleAddModal}>
                <Plus />
                {t('taxonomy.addTopicDescription')}
              </Button>
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
      </React.Fragment>
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
};

export default injectT(TopicDescription);
