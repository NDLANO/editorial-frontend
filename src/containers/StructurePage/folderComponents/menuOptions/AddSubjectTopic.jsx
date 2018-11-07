import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from '@ndla/icons/action';
import Button from 'ndla-button';
import InlineEditField from '../../../../components/InlineEditField';
import RoundIcon from '../../../../components/RoundIcon';
import { addTopic, addSubjectTopic } from '../../../../modules/taxonomy';

class AddSubjectTopic extends React.PureComponent {
  constructor() {
    super();
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onAddSubjectTopic(name) {
    const { id, refreshTopics } = this.props;
    const newPath = await addTopic({ name });
    if (!newPath) throw Error('Invalid topic path returned');
    const newId = newPath.replace('/v1/topics/', '');
    const ok = await addSubjectTopic({
      subjectid: id,
      topicid: newId,
      primary: true,
      // rank: this.state.topics[subjectid].length + 1,
    });
    if (ok) {
      refreshTopics();
    }
  }

  toggleEditMode() {
    this.props.toggleEditMode('addSubjectTopic');
  }

  render() {
    const { classes, onClose, t, editMode } = this.props;
    return editMode === 'addSubjectTopic' ? (
      <InlineEditField
        classes={classes}
        placeholder={t('taxonomy.newSubject')}
        currentVal=""
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onClose={onClose}
        onSubmit={this.onAddSubjectTopic}
        icon={<Plus />}
      />
    ) : (
      <Button
        {...classes('menuItem')}
        stripped
        data-testid="addSubjectTopicButon"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addTopic')}
      </Button>
    );
  }
}

AddSubjectTopic.propTypes = {
  classes: PropTypes.func,
  onClose: PropTypes.func,
  t: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
};

export default AddSubjectTopic;
