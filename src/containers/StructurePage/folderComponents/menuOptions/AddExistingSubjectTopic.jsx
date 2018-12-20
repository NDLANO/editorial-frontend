/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import RoundIcon from '../../../../components/RoundIcon';
import { addSubjectTopic, fetchTopics } from '../../../../modules/taxonomy';
import InlineDropdown from '../../../../components/Dropdown/InlineDropdown';
import MenuItemButton from './MenuItemButton';

class AddExistingSubjectTopic extends React.PureComponent {
  constructor() {
    super();
    this.onAddExistingTopic = this.onAddExistingTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.fetchTopicsLocale = this.fetchTopicsLocale.bind(this);
  }

  async onAddExistingTopic(topicid) {
    const { id, refreshTopics } = this.props;
    await addSubjectTopic({
      subjectid: id,
      topicid,
    });
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addExistingSubjectTopic');
  }

  fetchTopicsLocale() {
    return fetchTopics(this.props.locale || 'nb');
  }

  render() {
    const { classes, onClose, t, editMode } = this.props;
    return editMode === 'addExistingSubjectTopic' ? (
      <InlineDropdown
        fetchItems={this.fetchTopicsLocale}
        placeholder={t('taxonomy.existingTopic')}
        classes={classes}
        onClose={onClose}
        onSubmit={this.onAddExistingTopic}
        icon={<Plus />}
      />
    ) : (
      <MenuItemButton
        stripped
        data-testid="addExistingSubjectTopicButton"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addExistingTopic')}
      </MenuItemButton>
    );
  }
}

AddExistingSubjectTopic.propTypes = {
  classes: PropTypes.func,
  path: PropTypes.string,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  locale: PropTypes.string,
};

export default injectT(AddExistingSubjectTopic);
