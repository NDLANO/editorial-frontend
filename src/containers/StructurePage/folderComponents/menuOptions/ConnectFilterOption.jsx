import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Filter } from 'ndla-icons/editor';
import { Button } from 'ndla-ui';
import RoundIcon from '../../../../components/RoundIcon';
import ConnectFilters from '../ConnectFilters';

class ConnectFilterOption extends PureComponent {
  constructor() {
    super();
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.props.toggleEditMode('connectFilters');
  }

  render() {
    const {
      classes,
      id,
      path,
      filters,
      refreshTopics,
      subjectFilters,
      editMode,
      t,
    } = this.props;
    return (
      <React.Fragment>
        <Button {...classes('menuItem')} stripped onClick={this.toggleEditMode}>
          <RoundIcon
            small
            open={editMode === 'connectFilters'}
            icon={<Filter />}
          />
          {t('taxonomy.connectFilters')}
        </Button>
        {editMode === 'connectFilters' && (
          <ConnectFilters
            classes={classes}
            path={path}
            id={id}
            subjectFilters={subjectFilters}
            refreshTopics={refreshTopics}
            topicFilters={filters}
          />
        )}
      </React.Fragment>
    );
  }
}

ConnectFilterOption.propTypes = {
  toggleEditMode: PropTypes.func,
  classes: PropTypes.func,
  refreshTopics: PropTypes.func,
  id: PropTypes.number,
  path: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  subjectFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  editMode: PropTypes.string,
};

export default ConnectFilterOption;
