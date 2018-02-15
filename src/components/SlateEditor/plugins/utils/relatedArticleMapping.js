import React from 'react';
import { ContentTypeBadge, constants } from 'ndla-ui';

export const mapping = resource => {
  switch (resource) {
    case 'urn:resourcetype:subjectMaterial': {
      return {
        icon: (
          <ContentTypeBadge
            background
            type={constants.contentTypes.SUBJECT_MATERIAL}
          />
        ),
        modifier: 'subject-material',
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
        modifier: 'tasks-and-activities',
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
        modifier: 'subject-material',
      };
    }
  }
};
