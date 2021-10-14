/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

import {
  AddExistingToTopic,
  AddExistingToSubjectTopic,
  ChangeSubjectName,
  CopyResources,
  DeleteTopic,
  DeleteSubjectOption,
  EditGrepCodes,
  PublishTopic,
  ToggleVisibility,
  EditSubjectpageOption,
  EditCustomFields,
} from './menuOptions';
import { TaxonomyMetadata } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { PathArray } from '../../../util/retrieveBreadCrumbs';
import { EditMode } from '../../../interfaces';

interface Props {
  metadata: TaxonomyMetadata;
  numberOfSubtopics?: number;
  subjectId: string;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  path: string;
  locale: string;
  onClose: () => void;
  id: string;
  name: string;
  settingsMenuType?: 'topic' | 'subject';
  showAllOptions: boolean;
  setShowAlertModal: (show: boolean) => void;
  contentUri?: string;
  structure: PathArray;
  parent?: string;
}

const SettingsMenuDropdownType = ({
  subjectId,
  metadata,
  numberOfSubtopics,
  editMode,
  toggleEditMode,
  path,
  locale,
  onClose,
  name,
  id,
  contentUri,
  settingsMenuType,
  showAllOptions,
  setShowAlertModal,
  structure,
  parent,
}: Props) => {
  switch (settingsMenuType) {
    case 'subject':
      return showAllOptions ? (
        <>
          <ChangeSubjectName
            toggleEditMode={toggleEditMode}
            onClose={onClose}
            editMode={editMode}
            name={name}
            id={id}
            contentUri={contentUri}
          />
          <EditCustomFields
            type={settingsMenuType}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            subjectId={subjectId}
            id={id}
            name={name}
            metadata={metadata}
          />
          <AddExistingToSubjectTopic
            path={path}
            onClose={onClose}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
            locale={locale}
            id={id}
            structure={structure}
          />
          <ToggleVisibility
            menuType={settingsMenuType}
            editMode={editMode}
            id={id}
            name={name}
            metadata={metadata}
            toggleEditMode={toggleEditMode}
          />
          <EditGrepCodes
            menuType={settingsMenuType}
            editMode={editMode}
            id={id}
            name={name}
            metadata={metadata}
            toggleEditMode={toggleEditMode}
          />
          <EditSubjectpageOption id={id} locale={locale} />
          <DeleteSubjectOption
            id={id}
            locale={locale}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
          />
        </>
      ) : null;
    case 'topic':
      return (
        <>
          {showAllOptions && <PublishTopic locale={locale} id={id} />}
          {showAllOptions && parent && (
            <>
              <EditCustomFields
                type={settingsMenuType}
                toggleEditMode={toggleEditMode}
                editMode={editMode}
                subjectId={subjectId}
                id={id}
                name={name}
                metadata={metadata}
              />
              <DeleteTopic
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                parent={parent}
                id={id}
                locale={locale}
                subjectId={subjectId}
              />
              <AddExistingToTopic
                path={path}
                onClose={onClose}
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                locale={locale}
                id={id}
                subjectId={subjectId}
                numberOfSubtopics={numberOfSubtopics}
                structure={structure}
              />
              <ToggleVisibility
                menuType={settingsMenuType}
                editMode={editMode}
                id={id}
                name={name}
                metadata={metadata}
                toggleEditMode={toggleEditMode}
              />
              <EditGrepCodes
                menuType={settingsMenuType}
                editMode={editMode}
                id={id}
                name={name}
                metadata={metadata}
                toggleEditMode={toggleEditMode}
              />
            </>
          )}
          {showAllOptions && (
            <CopyResources
              locale={locale}
              id={id}
              setShowAlertModal={setShowAlertModal}
              subjectId={subjectId}
              structure={structure}
              onClose={onClose}
            />
          )}
        </>
      );
    default:
      return null;
  }
};

export default SettingsMenuDropdownType;
