import React from 'react';
import { ContentTypeBadge, constants } from '@ndla/ui';

export const mapping = (resource, relatedArticleEntryNum) => {
  const hiddenModifier = relatedArticleEntryNum > 1 ? ' hidden' : '';
  switch (resource) {
    case 'urn:resourcetype:subjectMaterial': {
      return {
        icon: (
          <ContentTypeBadge
            background
            type={constants.contentTypes.SUBJECT_MATERIAL}
          />
        ),
        modifier: `subject-material${hiddenModifier}`,
      };
    }
    case 'urn:resourcetype:tasksAndActivities': {
      return {
        icon: (
          <ContentTypeBadge
            background
            type={constants.contentTypes.TASKS_AND_ACTIVITIES}
          />
        ),
        modifier: `tasks-and-activities${hiddenModifier}`,
      };
    }
    case 'external-learning-resources': {
      return {
        icon: (
          <ContentTypeBadge
            background
            type={constants.contentTypes.EXTERNAL_LEARNING_RESOURCES}
          />
        ),
        modifier: `external-learning-resources${hiddenModifier}`,
      };
    }
    default: {
      return {
        icon: (
          <ContentTypeBadge
            background
            type={constants.contentTypes.SUBJECT_MATERIAL}
          />
        ),
        modifier: `subject-material${hiddenModifier}`,
      };
    }
  }
};
