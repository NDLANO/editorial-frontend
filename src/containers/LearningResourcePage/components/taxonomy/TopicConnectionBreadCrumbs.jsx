/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from '@ndla/icons/common';
import { StyledBreadCrumb } from '../../../../style/LearningResourceTaxonomyStyles';
import { TopicConnectionShape } from '../../../../shapes';

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
  topicConnection: TopicConnectionShape,
  retriveBreadCrumbs: PropTypes.func.isRequired,
};

export default TopicConnectionBreadCrumbs;
