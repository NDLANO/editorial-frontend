/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { string, bool, arrayOf, object, shape, func } from 'prop-types';
import Button from '@ndla/button';
import { Link as LinkIcon } from '@ndla/icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';
import EditLinkButton from './EditLinkButton';
import RoundIcon from '../../../components/RoundIcon';
import FilterView from './FilterView';

import FolderLink from '../../../components/FolderLink';

import { removeLastItemFromUrl } from '../../../util/routeHelpers';
import SubFolders from './SubFolders';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const FolderItem = ({
  name,
  path,
  active,
  match,
  id,
  refFunc,
  showLink,
  linkViewOpen,
  activeFilters,
  topics = [],
  toggleFilter,
  setPrimary,
  deleteTopicLink,
  ...rest
}) => {
  const { url, params } = match;
  const type = id.includes('subject') ? 'subject' : 'topic';
  const grayedOut = !active && params.subject && type === 'subject';
  const isMainActive = active && path === url.replace('/structure', '');
  const { search } = window.location;
  const uniqueId = type === 'topic' ? `${rest.parent}/${id}` : id;
  const toLink = isMainActive
    ? removeLastItemFromUrl(url).concat(search)
    : `/structure${path}${search}`;
  const sendToSubFolders = {
    type,
    active,
    topics,
    isMainActive,
    activeFilters,
    params,
    match,
    showLink,
    refFunc,
    setPrimary,
    linkViewOpen,
    ...rest,
  };
  const settingsButton = active && (
    <SettingsMenu id={id} name={name} type={type} path={path} {...rest} />
  );
  const showLinkButton = type === 'topic' &&
    isMainActive && (
      <Button stripped onClick={() => showLink(id, rest.parent)}>
        <RoundIcon open={linkViewOpen} icon={<LinkIcon />} />
      </Button>
    );
  const editLinkButton = type === 'subject' && (
    <EditLinkButton
      refFunc={refFunc}
      id={id}
      setPrimary={setPrimary}
      deleteTopicLink={deleteTopicLink}
    />
  );
  const subjectFilters = active &&
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
        <FolderLink
          toLink={toLink}
          name={name}
          active={active}
          grayedOut={grayedOut}
        />
        {showLinkButton}
        {editLinkButton}
        {settingsButton}
        {subjectFilters}
      </div>
      <SubFolders {...sendToSubFolders} />
    </React.Fragment>
  );
};

FolderItem.propTypes = {
  name: string.isRequired,
  path: string,
  active: bool,
  topics: arrayOf(object),
  match: shape({
    params: shape({
      topic1: string,
      topic2: string,
      subject: string,
    }),
  }),
  id: string,
  refFunc: func,
  showLink: func,
  linkViewOpen: bool,
  activeFilters: arrayOf(string),
  toggleFilter: func,
  setPrimary: func,
  deleteTopicLink: func,
  refreshTopics: func,
};

export default FolderItem;
