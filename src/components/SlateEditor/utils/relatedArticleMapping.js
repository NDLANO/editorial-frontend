import React from 'react';
import { ContentTypeBadge, constants } from '@ndla/ui';
import * as resourceTypeConstants from '../../../constants';

export const mapping = relatedArticleEntryNum => {
  const hiddenModifier = relatedArticleEntryNum > 1 ? ' hidden' : '';
  return {
    [resourceTypeConstants.RESOURCE_TYPE_SUBJECT_MATERIAL]: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.SUBJECT_MATERIAL}
        />
      ),
      modifier: `subject-material${hiddenModifier}`,
    },
    [resourceTypeConstants.RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.TASKS_AND_ACTIVITIES}
        />
      ),
      modifier: `tasks-and-activities${hiddenModifier}`,
    },
    [resourceTypeConstants.ARTICLE_EXTERNAL]: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.EXTERNAL_LEARNING_RESOURCES}
        />
      ),
      modifier: `external-learning-resources${hiddenModifier}`,
    },
    subject: {
      icon: (
        <ContentTypeBadge background type={constants.contentTypes.SUBJECT} />
      ),
      modifier: `subject${hiddenModifier}`,
    },
    default: {
      icon: (
        <ContentTypeBadge
          background
          type={constants.contentTypes.SUBJECT_MATERIAL}
        />
      ),
      modifier: `subject-material${hiddenModifier}`,
    },
  };
};
