/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { spacing, fonts } from '@ndla/core';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { css } from '@emotion/core';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';

import { TAXONOMY_ADMIN_SCOPE } from '../../../constants';
import AlertModal from '../../../components/AlertModal';
import {
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import Spinner from '../../../components/Spinner';
import { Row } from '../../../components';
import { useSession } from '../../Session/SessionProvider';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const resourceButtonStyle = css`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

interface BaseProps {
  getAllSubjects: () => Promise<void>;
  refreshTopics: () => Promise<void>;
  structure: SubjectType[];
  jumpToResources?: () => void;
  locale: string;
  name: string;
  pathToString: string;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  id: string;
  metadata: TaxonomyMetadata;
  setResourcesUpdated: (updated: boolean) => void;
  subjectId: string;
  saveSubjectItems: (
    subjectid: string,
    saveItems: { topics?: SubjectTopic[]; loading?: boolean; metadata?: TaxonomyMetadata },
  ) => void;
  saveSubjectTopicItems: (topicId: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  parent?: string;
}

type Props = BaseProps & RouteComponentProps;

const FolderItem = ({
  name,
  pathToString,
  id,
  jumpToResources,
  isMainActive,
  metadata,
  locale,
  resourcesLoading,
  getAllSubjects,
  refreshTopics,
  subjectId,
  setResourcesUpdated,
  saveSubjectItems,
  saveSubjectTopicItems,
  parent,
  structure,
}: Props) => {
  const { userAccess } = useSession();
  const type = id?.includes('subject') ? 'subject' : 'topic';
  const { t } = useTranslation();
  const showJumpToResources = isMainActive && type === 'topic';

  const [showAlertModal, setShowAlertModal] = useState(false);

  return (
    <div data-cy="folderWrapper" {...classes('wrapper')}>
      {isMainActive && (
        <SettingsMenu
          id={id}
          name={name}
          type={type}
          path={pathToString}
          showAllOptions={!!userAccess?.includes(TAXONOMY_ADMIN_SCOPE)}
          metadata={metadata}
          setShowAlertModal={setShowAlertModal}
          locale={locale}
          getAllSubjects={getAllSubjects}
          refreshTopics={refreshTopics}
          subjectId={subjectId}
          setResourcesUpdated={setResourcesUpdated}
          saveSubjectItems={saveSubjectItems}
          saveSubjectTopicItems={saveSubjectTopicItems}
          parent={parent}
          structure={structure}
        />
      )}
      {showJumpToResources && (
        <Button
          outline
          css={resourceButtonStyle}
          type="button"
          disabled={resourcesLoading}
          onClick={jumpToResources}>
          <Row>
            {t('taxonomy.jumpToResources')}
            {resourcesLoading && <Spinner appearance="small" />}
          </Row>
        </Button>
      )}
      {
        <AlertModal
          show={showAlertModal}
          text={t('taxonomy.resource.copyError')}
          actions={[
            {
              text: t('alertModal.continue'),
              onClick: () => {
                setShowAlertModal(false);
              },
            },
          ]}
          onCancel={() => {
            setShowAlertModal(false);
          }}
        />
      }
    </div>
  );
};

export default withRouter(FolderItem);
