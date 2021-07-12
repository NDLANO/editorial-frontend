/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Eye } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Switch } from '@ndla/switch';

import { updateSubjectMetadata } from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import { TaxonomyMetadata } from '../../../../interfaces';
import MenuItemButton from './MenuItemButton';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../../../constants';

interface Props {
  editMode: string;
  getAllSubjects: () => Promise<void>;
  id: string;
  name: string;
  metadata: TaxonomyMetadata;
  refreshTopics: () => void;
  setResourcesUpdated: (updated: boolean) => void;
  toggleEditMode: (name: string) => Promise<void>;
}

export const DropDownWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const ToggleExplanationSubject = ({
  editMode,
  getAllSubjects,
  id,
  name,
  metadata,
  refreshTopics,
  setResourcesUpdated,
  t,
  toggleEditMode,
}: Props & tType) => {
  const [explanationSubject, setExplanationSubject] = useState(
    metadata?.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]?.toLowerCase() === 'true',
  );
  const toggleExplanationSubject = async () => {
    await updateSubjectMetadata(id, {
      ...metadata,
      customFields: {
        ...metadata.customFields,
        [TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]: !explanationSubject,
      },
    });
    setExplanationSubject(prev => !prev);
    getAllSubjects();
    refreshTopics();
    setResourcesUpdated(true);
  };
  const toggleEditModes = () => toggleEditMode('toggleMetadataExplanationSubject');

  const toggle = (
    <DropDownWrapper>
      {name}{' '}
      {t(explanationSubject ? 'metadata.explanationSubject' : 'metadata.notExplanationSubject')}
      <Switch
        onChange={toggleExplanationSubject}
        checked={explanationSubject}
        label=""
        id={'explanationSubject'}
      />
    </DropDownWrapper>
  );

  return (
    <>
      <MenuItemButton
        stripped
        data-testid="toggleExplanationSubjectButton"
        onClick={toggleEditModes}>
        <RoundIcon small icon={<Eye />} />
        {t('metadata.changeExplanationSubject')}
      </MenuItemButton>
      {editMode === 'toggleMetadataExplanationSubject' && toggle}
    </>
  );
};

export default injectT(ToggleExplanationSubject);
