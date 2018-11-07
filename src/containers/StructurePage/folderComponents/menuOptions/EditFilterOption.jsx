import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Filter } from '@ndla/icons/editor';
import Button from 'ndla-button';
import RoundIcon from '../../../../components/RoundIcon';
import EditFilters from '../EditFilters';

class EditFilterOption extends PureComponent {
  constructor() {
    super();
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.props.toggleEditMode('editFilters');
  }

  render() {
    const { classes, t, editMode, getFilters, subjectFilters, id } = this.props;
    return (
      <React.Fragment>
        <Button
          {...classes('menuItem')}
          stripped
          data-testid="editSubjectFiltersButton"
          onClick={this.toggleEditMode}>
          <RoundIcon
            small
            open={editMode === 'editFilters'}
            icon={<Filter />}
          />
          {t('taxonomy.editFilter')}
        </Button>
        {editMode === 'editFilters' && (
          <EditFilters
            classes={classes}
            id={id}
            getFilters={getFilters}
            filters={subjectFilters}
          />
        )}
      </React.Fragment>
    );
  }
}

EditFilterOption.propTypes = {
  toggleEditMode: PropTypes.func,
  classes: PropTypes.func,
  refreshTopics: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  subjectFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  getFilters: PropTypes.func,
  editMode: PropTypes.string,
};

export default EditFilterOption;
