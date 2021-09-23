/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
import { Settings } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { useState } from 'react';
import Overlay from '../../../components/Overlay';
import RoundIcon from '../../../components/RoundIcon';
import {
  SubjectTopic,
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import SettingsMenuDropdown from './SettingsMenuDropdown';
import { PathArray } from '../../../util/retrieveBreadCrumbs';
import { EditMode } from '../../../interfaces';

const StyledDivWrapper = styled('div')`
  position: relative;
  display: flex;

  > button {
    outline: none;
  }
`;

interface Props {
  type: string;
  setShowAlertModal: (show: boolean) => void;
  id: string;
  name: string;
  path: string;
  showAllOptions: boolean;
  metadata: TaxonomyMetadata;
  locale: string;
  getAllSubjects: () => Promise<void>;
  refreshTopics: () => Promise<void>;
  subjectId: string;
  setResourcesUpdated: (updated: boolean) => void;
  saveSubjectItems: (
    subjectid: string,
    saveItems: { topics?: SubjectTopic[]; loading?: boolean; metadata?: TaxonomyMetadata },
  ) => void;
  saveSubjectTopicItems: (topicId: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  parent?: string;
  structure: PathArray;
}

const SettingsMenu = ({
  type,
  setShowAlertModal,
  id,
  name,
  path,
  locale,
  metadata,
  showAllOptions,
  getAllSubjects,
  refreshTopics,
  subjectId,
  setResourcesUpdated,
  saveSubjectItems,
  saveSubjectTopicItems,
  parent,
  structure,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState('');

  const toggleEditMode = (mode: EditMode) => {
    setEditMode(prev => (mode === prev ? '' : mode));
  };

  const toggleOpenMenu = () => {
    setOpen(!open);
  };

  return (
    <StyledDivWrapper>
      <Button onClick={toggleOpenMenu} data-cy={`settings-button-${type}`} stripped>
        <RoundIcon icon={<Settings />} margin open={open} />
      </Button>
      {open && (
        <>
          <Overlay modifiers={['zIndex']} onExit={toggleOpenMenu} />
          <SettingsMenuDropdown
            onClose={toggleOpenMenu}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            setShowAlertModal={setShowAlertModal}
            id={id}
            name={name}
            type={type}
            locale={locale}
            metadata={metadata}
            path={path}
            showAllOptions={showAllOptions}
            getAllSubjects={getAllSubjects}
            refreshTopics={refreshTopics}
            subjectId={subjectId}
            setResourcesUpdated={setResourcesUpdated}
            saveSubjectItems={saveSubjectItems}
            saveSubjectTopicItems={saveSubjectTopicItems}
            parent={parent}
            structure={structure}
          />
        </>
      )}
    </StyledDivWrapper>
  );
};

export default SettingsMenu;
