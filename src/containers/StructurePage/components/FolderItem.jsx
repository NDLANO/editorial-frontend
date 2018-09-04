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
import { Link as LinkIcon } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';
import EditLinkButton from './EditLinkButton';
import RoundIcon from '../../../components/RoundIcon';
import FilterView from './FilterView';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import FolderLink from './FolderLink';
import {
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../../modules/taxonomy';
import { removeLastItemFromUrl } from '../../../util/routeHelpers';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

class FolderItem extends React.PureComponent {
  constructor() {
    super();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async onDragEnd({ destination, source }) {
    const { topics, refreshTopics } = this.props;
    // dropped outside the list
    if (!destination) {
      return;
    }
    try {
      const { connectionId, isPrimary } = topics[source.index];
      const { rank } = topics[destination.index];

      if (connectionId.includes('topic-subtopic')) {
        const ok = await updateTopicSubtopic(connectionId, {
          rank,
          primary: isPrimary,
        });
        if (ok) refreshTopics();
      } else {
        const ok = await updateSubjectTopic(connectionId, {
          rank,
          primary: isPrimary,
        });
        if (ok) refreshTopics();
      }
    } catch (e) {
      handleError(e.message);
    }
  }

  render() {
    const {
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
    } = this.props;
    const { url, params } = match;

    const type = id.includes('subject') ? 'subject' : 'topic';
    const grayedOut = !active && params.subject && type === 'subject';
    const isMainActive = active && path === url.replace('/structure', '');
    const { search } = window.location;
    const uniqueId = type === 'topic' ? `${rest.parent}${id}` : id;
    const toLink = isMainActive
      ? removeLastItemFromUrl(url).concat(search)
      : `/structure${path}${search}`;
    return (
      <React.Fragment>
        <div id={uniqueId} {...classes('wrapper')}>
          <FolderLink
            toLink={toLink}
            name={name}
            active={active}
            grayedOut={grayedOut}
          />
          {type === 'topic' &&
            isMainActive && (
              <Button stripped onClick={() => showLink(id, rest.parent)}>
                <RoundIcon open={linkViewOpen} icon={<LinkIcon />} />
              </Button>
            )}
          {active && (
            <SettingsMenu
              id={id}
              name={name}
              type={type}
              path={path}
              {...rest}
            />
          )}
          {active &&
            type === 'subject' && (
              <FilterView
                subjectFilters={rest.subjectFilters}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
              />
            )}
        </div>
        <div {...classes('subFolders')}>
          {active && (
            <MakeDndList onDragEnd={this.onDragEnd} disableDnd={!isMainActive}>
              {topics.map(topic => {
                if (
                  activeFilters.length === 0 ||
                  activeFilters.some(activeFilter =>
                    topic.filters.some(filter => filter.id === activeFilter),
                  )
                ) {
                  return (
                    <FolderItem
                      {...rest}
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
                      setPrimary={setPrimary}
                      activeFilters={activeFilters}
                    />
                  );
                }
                return undefined;
              })}
            </MakeDndList>
          )}
        </div>
        {type === 'subject' && (
          <EditLinkButton
            refFunc={refFunc}
            id={id}
            setPrimary={() => setPrimary(id)}
            deleteTopicLink={deleteTopicLink}
          />
        )}
      </React.Fragment>
    );
  }
}

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
