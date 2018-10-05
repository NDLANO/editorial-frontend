import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Pencil } from 'ndla-icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import InlineEditField from '../../../../components/InlineEditField';
import { updateSubjectName } from '../../../../modules/taxonomy';

class ChangeSubjectName extends Component {
  constructor() {
    super();
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
  }

  async onChangeSubjectName(name) {
    const { id, getAllSubjects } = this.props;
    const ok = await updateSubjectName(id, name);
    getAllSubjects();
    return ok;
  }

  toggleEditMode() {
    this.props.toggleEditMode('changeSubjectName');
  }

  render() {
    const { editMode, t, classes, name, onClose } = this.props;
    return editMode === 'changeSubjectName' ? (
      <InlineEditField
        classes={classes}
        currentVal={name}
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onSubmit={this.onChangeSubjectName}
        onClose={onClose}
        icon={<Pencil />}
      />
    ) : (
      <Button
        {...classes('menuItem')}
        stripped
        data-testid="changeSubjectNameButton"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.changeName')}
      </Button>
    );
  }
}

ChangeSubjectName.propTypes = {
  toggleEditMode: PropTypes.func,
  classes: PropTypes.func,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  name: PropTypes.string,
};

export default ChangeSubjectName;
