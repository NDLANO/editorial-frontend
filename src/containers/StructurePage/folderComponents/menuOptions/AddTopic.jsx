import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from '@ndla/icons/action';
import Button from 'ndla-button';
import InlineEditField from '../../../../components/InlineEditField';
import RoundIcon from '../../../../components/RoundIcon';
import { addTopic, addTopicToTopic } from '../../../../modules/taxonomy';

class AddTopic extends React.PureComponent {
  constructor() {
    super();
    this.onAddSubTopic = this.onAddSubTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onAddSubTopic(name) {
    const { id, numberOfSubtopics, refreshTopics } = this.props;
    const newPath = await addTopic({ name });
    if (!newPath) throw Error('Invalid topic path returned');
    const newId = newPath.replace('/v1/topics/', '');
    await addTopicToTopic({
      subtopicid: newId,
      topicid: id,
      primary: true,
      rank: numberOfSubtopics + 1,
    });
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addTopic');
  }

  render() {
    const { classes, onClose, t, editMode } = this.props;
    return editMode === 'addTopic' ? (
      <InlineEditField
        placeholder={t('taxonomy.newTopic')}
        classes={classes}
        currentVal=""
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onClose={onClose}
        onSubmit={this.onAddSubTopic}
        icon={<Plus />}
      />
    ) : (
      <Button {...classes('menuItem')} stripped onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addTopic')}
      </Button>
    );
  }
}

AddTopic.propTypes = {
  classes: PropTypes.func,
  onClose: PropTypes.func,
  t: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
};

export default AddTopic;
