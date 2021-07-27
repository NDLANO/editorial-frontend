/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { colors, spacing, animations, shadows } from '@ndla/core';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Settings } from '@ndla/icons/editor';
import RoundIcon from '../../../components/RoundIcon';
import SettingsMenuDropdownType from './SettingsMenuDropdownType';
import CrossButton from '../../../components/CrossButton';
import {
  SubjectTopic,
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { PathArray } from '../../../util/retrieveBreadCrumbs';

interface Props {
  onClose: () => void;
  id: string;
  name: string;
  type: string;
  setShowAlertModal: (show: boolean) => void;
  locale: string;
  metadata: TaxonomyMetadata;
  path: string;
  showAllOptions: boolean;
  getAllSubjects: () => Promise<void>;
  refreshTopics: () => Promise<void>;
  subjectId: string;
  editMode: string;
  toggleEditMode: (mode: string) => void;
  setResourcesUpdated: (updated: boolean) => void;
  saveSubjectTopicItems: (topicId: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  saveSubjectItems: (
    subjectid: string,
    saveItems: { topics?: SubjectTopic[]; loading?: boolean; metadata?: TaxonomyMetadata },
  ) => void;
  parent: string;
  structure: PathArray;
}

const SettingsMenuDropdown = ({
  onClose,
  t,
  id,
  setShowAlertModal,
  metadata,
  saveSubjectItems,
  saveSubjectTopicItems,
  getAllSubjects,
  refreshTopics,
  subjectId,
  editMode,
  toggleEditMode,
  path,
  locale,
  setResourcesUpdated,
  name,
  showAllOptions,
  structure,
  parent,
}: Props & tType) => {
  const settingsMenuType = id.includes('subject') ? 'subject' : 'topic';
  return (
    <StyledDivWrapper>
      <div className="header">
        <RoundIcon icon={<Settings />} open />
        <span
          css={css`
            margin-left: calc(${spacing.small} / 2);
          `}>
          {t(`taxonomy.${settingsMenuType}Settings`)}
        </span>
        <CrossButton stripped css={closeButtonStyle} onClick={onClose} />
      </div>
      <SettingsMenuDropdownType
        onClose={onClose}
        metadata={metadata}
        id={id}
        settingsMenuType={settingsMenuType}
        setShowAlertModal={setShowAlertModal}
        saveSubjectItems={saveSubjectItems}
        saveSubjectTopicItems={saveSubjectTopicItems}
        getAllSubjects={getAllSubjects}
        refreshTopics={refreshTopics}
        subjectId={subjectId}
        editMode={editMode}
        toggleEditMode={toggleEditMode}
        path={path}
        locale={locale}
        setResourcesUpdated={setResourcesUpdated}
        name={name}
        showAllOptions={showAllOptions}
        structure={structure}
        parent={parent}
      />
    </StyledDivWrapper>
  );
};

const closeButtonStyle = css`
  color: ${colors.brand.grey};
  margin-left: auto;
`;

export const StyledDivWrapper = styled('div')`
  position: absolute;
  ${animations.fadeIn()}
  box-shadow: ${shadows.levitate1};
  z-index: 2;
  top: -1px;
  padding: calc(${spacing.small} / 2);
  width: 550px;
  background-color: ${colors.brand.greyLightest};
  box-shadow: 0 0 4px 0 rgba(78, 78, 78, 0.5);

  & .header {
    display: flex;
    align-items: center;
  }
`;

export default injectT(SettingsMenuDropdown);
