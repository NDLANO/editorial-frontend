import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from '@ndla/icons/common';
import { StyledBreadCrumb } from '../../../../style/LearningResourceTaxonomyStyles';

export const TopicConnectionBreadCrumbs = ({
  topicConnection,
  topic,
  retriveBreadCrumbs,
}) => {
  const topicConnectionsBreadCrumbs = retriveBreadCrumbs(
    topicConnection.paths[0],
  );
  return (
    <StyledBreadCrumb>
      {topicConnectionsBreadCrumbs.map((path, index) => (
        <Fragment key={`${topic.id}_${index}`}>
          <span>{path.name}</span>
          <ChevronRight />
        </Fragment>
      ))}
      <span>{topic.name}</span>
      <ChevronRight />
    </StyledBreadCrumb>
  );
};

TopicConnectionBreadCrumbs.propTypes = {
  topic: PropTypes.object,
  topicConnection: PropTypes.shape({}),
  retriveBreadCrumbs: PropTypes.func.isRequired,
};

export default TopicConnectionBreadCrumbs;
