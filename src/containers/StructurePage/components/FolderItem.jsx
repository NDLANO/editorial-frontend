/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { string, bool, arrayOf, object, shape, func } from 'prop-types';
import { Button } from 'ndla-ui';
import { Folder, Link as LinkIcon } from 'ndla-icons/editor';
import { Link as RouterLink } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';
import EditLinkButton from './EditLinkButton';
import RoundIcon from './RoundIcon';
import FilterView from './FilterView';

const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const FolderItem = ({
  name,
  path,
  active,
  topics = [],
  match,
  id,
  refFunc,
  showLink,
  linkViewOpen,
  activeFilters,
  toggleFilter,
  ...rest
}) => {
  const { url, params } = match;
  const type = id.includes('subject') ? 'subject' : 'topic';
  const grayedOut = !active && params.subject && type === 'subject';

  return (
    <React.Fragment>
      <div ref={element => refFunc(element, id)} {...classes('wrapper')}>
        <RouterLink
          to={
            active && path.length === url.replace('/structure', '').length
              ? `${url
                  .split('/')
                  .splice(0, url.split('/').length - 1)
                  .join('/')}`
              : `/structure${path}`
          }
          {...classes(
            'link',
            `${active && 'active'} ${grayedOut && 'grayedOut'}`,
          )}>
          <Folder {...classes('folderIcon')} color="#70A5DA" />
          {name}
        </RouterLink>
        {active &&
          type === 'topic' &&
          false && (
            <Button stripped onClick={() => showLink(id)}>
              <RoundIcon icon={<LinkIcon />} />
            </Button>
          )}
        {active && (
          <SettingsMenu id={id} name={name} type={type} path={path} {...rest} />
        )}
        {active &&
          type === 'subject' && (
            <FilterView
              filters={rest.filters}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
            />
          )}
      </div>
      <div {...classes('subFolders')}>
        {active &&
          topics.map(topic => (
            <FolderItem
              {...topic}
              key={topic.id}
              active={
                params.topic1 === topic.id.replace('urn:', '') ||
                params.topic2 === topic.id.replace('urn:', '') ||
                params.topic3 === topic.id.replace('urn:', '')
              }
              match={match}
              showLink={showLink}
              refFunc={refFunc}
              linkViewOpen={linkViewOpen}
              {...rest}
            />
          ))}
      </div>
      <EditLinkButton refFunc={refFunc} id={id} setPrimary={() => {}} />
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
};

export default FolderItem;
