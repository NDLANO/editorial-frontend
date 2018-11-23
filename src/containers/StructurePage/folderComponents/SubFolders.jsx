import React from 'react';
import { string, bool, arrayOf, object, shape } from 'prop-types';
import FolderItem, { classes } from './FolderItem';
import MakeDndList from '../../../components/MakeDndList';
import handleError from '../../../util/handleError';
import {
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../../modules/taxonomy';
import config from '../../../config';

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
      match,
      ...rest
    } = this.props;
    const filteredTopics = topics.filter(
      topic =>
        activeFilters.length === 0 ||
        activeFilters.some(activeFilter =>
          topic.filters.some(filter => filter.id === activeFilter),
        ),
    );

    return (
      <div data-cy={`${type}-subFolders`} {...classes('subFolders')}>
        {active && (
          <MakeDndList
            onDragEnd={this.onDragEnd}
            disableDnd={!config.enableFullTaxonomy || !isMainActive}>
            {filteredTopics.map(topic => (
              <FolderItem
                {...rest}
                {...topic}
                key={topic.id}
                active={match.url.includes(topic.id.replace('urn:', ''))}
                activeFilters={activeFilters}
                match={match}
              />
            ))}
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
  match: shape({
    url: string,
  }),
  activeFilters: arrayOf(string),
};

export default SubFolders;
