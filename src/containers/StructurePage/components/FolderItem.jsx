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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';
import EditLinkButton from './EditLinkButton';
import RoundIcon from './RoundIcon';
import { removeLastItemFromUrl } from '../../../util/routeHelpers';
import { reorder } from '../../../util/taxonomyHelpers';

const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

class FolderItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topics: props.topics || [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.topics !== this.props.topics) {
      this.setState({ topics: nextProps.topics });
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const topics = reorder(
      this.state.topics,
      result.source.index,
      result.destination.index,
    );
    console.log(result);

    this.setState({
      topics,
    });
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
      isDragging,
      onChangeSubjectName,
      onAddSubjectTopic,
      onAddExistingTopic,
      refreshTopics,
      parent,
      connectionId,
    } = this.props;
    const { url, params } = match;
    const { topics } = this.state;
    const sendAllTheWayDown = {
      onChangeSubjectName,
      onAddSubjectTopic,
      onAddExistingTopic,
      refreshTopics,
      match,
      showLink,
      refFunc,
      linkViewOpen,
    };
    const type = id.includes('subject') ? 'subject' : 'topic';
    const isMainActive = active && path === url.replace('/structure', '');
    return (
      <React.Fragment>
        <div
          ref={element => refFunc(element, id)}
          {...classes('wrapper', isDragging ? 'dragging' : '')}>
          <RouterLink
            to={isMainActive ? removeLastItemFromUrl(url) : `/structure${path}`}
            {...classes('link', active && 'active')}>
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
            <SettingsMenu
              id={id}
              name={name}
              type={type}
              path={path}
              onChangeSubjectName={onChangeSubjectName}
              onAddSubjectTopic={onAddSubjectTopic}
              onAddExistingTopic={onAddExistingTopic}
              refreshTopics={refreshTopics}
              parent={parent}
              connectionId={connectionId}
              numberOfSubtopics={topics.length}
            />
          )}
        </div>
        <div {...classes('subFolders')}>
          {isMainActive ? (
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...classes(
                      'drop-zone',
                      snapshot.isDraggingOver ? 'dragging' : '',
                    )}>
                    {topics.map((topic, index) => (
                      <Draggable
                        key={topic.id}
                        draggableId={topic.id}
                        index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FolderItem
                              {...topic}
                              isDragging={snapshot.isDragging}
                              key={topic.id}
                              active={
                                params.topic1 ===
                                  topic.id.replace('urn:', '') ||
                                params.topic2 ===
                                  topic.id.replace('urn:', '') ||
                                params.topic3 === topic.id.replace('urn:', '')
                              }
                              {...sendAllTheWayDown}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            active &&
            topics.map(topic => (
              <FolderItem
                {...topic}
                key={topic.id}
                active={
                  params.topic1 === topic.id.replace('urn:', '') ||
                  params.topic2 === topic.id.replace('urn:', '') ||
                  params.topic3 === topic.id.replace('urn:', '')
                }
                {...sendAllTheWayDown}
              />
            ))
          )}
        </div>
        <EditLinkButton refFunc={refFunc} id={id} setPrimary={() => {}} />
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
  isDragging: bool,
  onChangeSubjectName: func,
  onAddSubjectTopic: func,
  onAddExistingTopic: func,
  refreshTopics: func,
  parent: string,
  connectionId: string,
};

export default FolderItem;
