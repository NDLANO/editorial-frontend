import React from 'react';
import { string, bool, arrayOf, object, shape } from 'prop-types';
import FolderItem, { classes } from './FolderItem';
import MakeDndList from '../../../components/MakeDndList';
import handleError from '../../../util/handleError';
import {
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../../modules/taxonomy';

class SubFolders extends React.PureComponent {
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
      type,
      active,
      topics,
      isMainActive,
      activeFilters,
      params,
      ...rest
    } = this.props;
    return (
      <div data-cy={`${type}-subFolders`} {...classes('subFolders')}>
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
                    activeFilters={activeFilters}
                  />
                );
              }
              return undefined;
            })}
          </MakeDndList>
        )}
      </div>
    );
  }
}

SubFolders.propTypes = {
  active: bool,
  topics: arrayOf(object),
  type: string,
  isMainActive: bool,
  params: shape({
    topic1: string,
    topic2: string,
    subject: string,
  }),
  activeFilters: arrayOf(string),
};

export default SubFolders;
