import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from '@ndla/icons/action';
import Button from 'ndla-button';
import InlineDropdown from '../../../../components/Dropdown/InlineDropdown';
import RoundIcon from '../../../../components/RoundIcon';
import { fetchTopics, addTopicToTopic } from '../../../../modules/taxonomy';

class AddExistingTopic extends React.PureComponent {
  constructor() {
    super();
    this.onAddExistingSubTopic = this.onAddExistingSubTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.fetchTopicsLocale = this.fetchTopicsLocale.bind(this);
  }

  async onAddExistingSubTopic(subTopicId) {
    const { id, numberOfSubtopics, refreshTopics } = this.props;
    await addTopicToTopic({
      subtopicid: subTopicId,
      topicid: id,
      primary: false,
      rank: numberOfSubtopics + 1,
    });
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addExistingTopic');
  }

  fetchTopicsLocale() {
    return fetchTopics(this.props.locale || 'nb');
  }

  render() {
    const { classes, t, path, onClose, editMode } = this.props;
    return editMode === 'addExistingTopic' ? (
      <InlineDropdown
        placeholder={t('taxonomy.existingTopic')}
        fetchItems={this.fetchTopicsLocale}
        filter={path.split('/')[1]}
        classes={classes}
        onClose={onClose}
        onSubmit={this.onAddExistingSubTopic}
        icon={<Plus />}
      />
    ) : (
      <Button {...classes('menuItem')} stripped onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addExistingTopic')}
      </Button>
    );
  }
}

AddExistingTopic.propTypes = {
  classes: PropTypes.func,
  path: PropTypes.string,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  locale: PropTypes.string,
};

export default AddExistingTopic;
