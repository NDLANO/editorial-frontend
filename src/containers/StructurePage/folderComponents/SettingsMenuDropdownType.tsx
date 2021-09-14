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
import {
  SubjectTopic,
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { PathArray } from '../../../util/retrieveBreadCrumbs';
import { EditMode } from '../../../interfaces';

interface Props {
  metadata: TaxonomyMetadata;
  saveSubjectTopicItems: (topicId: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  saveSubjectItems: (
    subjectid: string,
    saveItems: { topics?: SubjectTopic[]; loading?: boolean; metadata?: TaxonomyMetadata },
  ) => void;
  getAllSubjects: () => Promise<void>;
  numberOfSubtopics?: number;
  refreshTopics: () => Promise<void>;
  subjectId: string;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  path: string;
  locale: string;
  setResourcesUpdated: (updated: boolean) => void;
  onClose: () => void;
  id: string;
  name: string;
  settingsMenuType?: 'topic' | 'subject';
  showAllOptions: boolean;
  setShowAlertModal: (show: boolean) => void;
  contentUri?: string;
  structure: PathArray;
  parent: string;
}

const SettingsMenuDropdownType = ({
  metadata,
  saveSubjectTopicItems,
  saveSubjectItems,
  getAllSubjects,
  numberOfSubtopics,
  refreshTopics,
  subjectId,
  editMode,
  toggleEditMode,
  path,
  locale,
  setResourcesUpdated,
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
            getAllSubjects={getAllSubjects}
            refreshTopics={refreshTopics}
          />
          <EditCustomFields
            type={settingsMenuType}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            saveSubjectItems={saveSubjectItems}
            saveSubjectTopicItems={saveSubjectTopicItems}
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
            refreshTopics={refreshTopics}
            structure={structure}
          />
          <ToggleVisibility
            menuType={settingsMenuType}
            editMode={editMode}
            getAllSubjects={getAllSubjects}
            id={id}
            name={name}
            metadata={metadata}
            refreshTopics={refreshTopics}
            setResourcesUpdated={setResourcesUpdated}
            toggleEditMode={toggleEditMode}
          />
          <EditGrepCodes
            menuType={settingsMenuType}
            editMode={editMode}
            id={id}
            name={name}
            metadata={metadata}
            refreshTopics={refreshTopics}
            toggleEditMode={toggleEditMode}
            getAllSubjects={getAllSubjects}
          />
          <EditSubjectpageOption id={id} locale={locale} />
          <DeleteSubjectOption
            id={id}
            locale={locale}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
            getAllSubjects={getAllSubjects}
          />
        </>
      ) : null;
    case 'topic':
      return (
        <>
          {showAllOptions && (
            <PublishTopic locale={locale} id={id} setResourcesUpdated={setResourcesUpdated} />
          )}
          {showAllOptions && (
            <>
              <EditCustomFields
                type={settingsMenuType}
                toggleEditMode={toggleEditMode}
                editMode={editMode}
                saveSubjectItems={saveSubjectItems}
                saveSubjectTopicItems={saveSubjectTopicItems}
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
                refreshTopics={refreshTopics}
                locale={locale}
              />
              <AddExistingToTopic
                path={path}
                onClose={onClose}
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                locale={locale}
                id={id}
                numberOfSubtopics={numberOfSubtopics}
                structure={structure}
                refreshTopics={refreshTopics}
              />
              <ToggleVisibility
                menuType={settingsMenuType}
                editMode={editMode}
                getAllSubjects={getAllSubjects}
                id={id}
                name={name}
                metadata={metadata}
                refreshTopics={refreshTopics}
                setResourcesUpdated={setResourcesUpdated}
                toggleEditMode={toggleEditMode}
              />
              <EditGrepCodes
                menuType={settingsMenuType}
                editMode={editMode}
                id={id}
                name={name}
                metadata={metadata}
                refreshTopics={refreshTopics}
                toggleEditMode={toggleEditMode}
                getAllSubjects={getAllSubjects}
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
              setResourcesUpdated={setResourcesUpdated}
            />
          )}
        </>
      );
    default:
  }
};

export default SettingsMenuDropdownType;
