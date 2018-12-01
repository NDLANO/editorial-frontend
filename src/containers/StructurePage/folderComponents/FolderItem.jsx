/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { string, bool, arrayOf, shape, func } from 'prop-types';
import Button from '@ndla/button';
import { Link as LinkIcon } from '@ndla/icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';
import EditLinkButton from './EditLinkButton';
import RoundIcon from '../../../components/RoundIcon';
import FilterView from './FilterView';

import config from '../../../config';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const FolderItem = ({
  name,
  pathToString,
  match,
  id,
  isOpen,
  refFunc,
  showLink,
  linkViewOpen,
  activeFilters,
  toggleFilter,
  setPrimary,
  deleteTopicLink,
  filters,
  ...rest
}) => {
  const { url } = match;
  const type = id.includes('subject') ? 'subject' : 'topic';
  const isMainActive = pathToString === url.replace('/structure', '');
  const uniqueId = type === 'topic' ? `${rest.parent}/${id}` : id;

  const settingsButton = isOpen &&
    config.enableFullTaxonomy && (
      <SettingsMenu
        id={id}
        name={name}
        type={type}
        path={pathToString}
        topicFilters={filters}
        {...rest}
      />
    );
  const showLinkButton = isOpen &&
    type === 'topic' &&
    config.enableFullTaxonomy &&
    isMainActive && (
      <Button stripped onClick={() => showLink(id, rest.parent)}>
        <RoundIcon open={linkViewOpen} icon={<LinkIcon />} />
      </Button>
    );
  const editLinkButton = isOpen &&
    type === 'subject' && (
      <EditLinkButton
        refFunc={refFunc}
        id={id}
        setPrimary={setPrimary}
        deleteTopicLink={deleteTopicLink}
      />
    );
  const subjectFilters = isOpen &&
    type === 'subject' && (
      <FilterView
        subjectFilters={rest.subjectFilters}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />
    );

  return (
    <React.Fragment>
      <div id={uniqueId} data-cy="folderWrapper" {...classes('wrapper')}>
        {showLinkButton}
        {editLinkButton}
        {settingsButton}
        {subjectFilters}
      </div>
    </React.Fragment>
  );
};

FolderItem.propTypes = {
  name: string.isRequired,
  pathToString: string,
  isOpen: bool,
  match: shape({
    params: shape({
      topic1: string,
      topic2: string,
      subject: string,
    }),
  }),
  id: string.isRequired,
  refFunc: func,
  showLink: func,
  linkViewOpen: bool,
  activeFilters: arrayOf(string),
  toggleFilter: func,
  setPrimary: func,
  deleteTopicLink: func,
  refreshTopics: func,
  filters: arrayOf(
    shape({
      id: string,
    }),
  ),
};

export default FolderItem;
