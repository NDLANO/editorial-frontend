import React from 'react';
import PropTypes from 'prop-types';
import { Pencil } from 'ndla-icons/action';
import { Button } from 'ndla-ui';
import InlineEditField from '../../../../components/InlineEditField';
import RoundIcon from '../../../../components/RoundIcon';
import { updateTopic } from '../../../../modules/taxonomy';

class ChangeTopicName extends React.PureComponent {
  constructor() {
    super();
    this.onChangeTopicName = this.onChangeTopicName.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onChangeTopicName(newName) {
    const { id, contentUri, refreshTopics } = this.props;
    try {
      await updateTopic({
        id,
        name: newName,
        contentUri,
      });
      refreshTopics();
    } catch (e) {
      throw new Error(e);
    }
  }

  toggleEditMode() {
    this.props.toggleEditMode('changeTopicName');
  }

  render() {
    const { classes, name, t, onClose, editMode } = this.props;
    return editMode === 'changeTopicName' ? (
      <InlineEditField
        classes={classes}
        currentVal={name}
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onSubmit={this.onChangeTopicName}
        onClose={onClose}
        icon={<Pencil />}
      />
    ) : (
      <Button
        {...classes('menuItem')}
        stripped
        data-cy="change-topic-name"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.changeName')}
      </Button>
    );
  }
}

ChangeTopicName.propTypes = {
  toggleEditMode: PropTypes.func,
  classes: PropTypes.func,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  name: PropTypes.string,
};

export default ChangeTopicName;
