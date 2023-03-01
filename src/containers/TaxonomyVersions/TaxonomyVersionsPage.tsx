/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import partition from 'lodash/partition';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../components';
import { VersionType } from '../../modules/taxonomy/versions/versionApiTypes';
import Footer from '../App/components/Footer';
import Version from './components/Version';
import VersionForm from './components/VersionForm';
import VersionList from './components/VersionList';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import DeletePublishRequests from './components/DeletePublishRequests';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from '../../constants';

const NewFormWrapper = styled.div`
  padding: ${spacing.normal};
  border: 1.5px solid ${colors.brand.primary};
  border-radius: 5px;
`;

const FormSpacingWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const ButtonContainer = styled.div`
  justify-content: flex-start;
  display: flex;
  padding-top: ${spacing.normal};
  flex: 1;
  height: 100%;
  flex-direction: column;
  gap: ${spacing.small};
`;

const getPublishedAndOther = (
  versions: VersionType[],
): { published: VersionType | undefined; other: VersionType[] } => {
  const [published, other] = partition(versions, v => v.versionType === 'PUBLISHED');
  return {
    published: published[0],
    other,
  };
};

const TaxonomyVersionsPage = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const { data } = useVersions();

  const { data: publishRequests } = useNodes({
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: 'true',
    taxonomyVersion: 'default',
  });

  const { published, other } = getPublishedAndOther(data ?? []);

  const { t } = useTranslation();
  return (
    <>
      <OneColumn>
        <HelmetWithTracker title={t('htmlTitles.versionsPage')} />
        <h1>{t('taxonomyVersions.title')}</h1>
        <Row alignItems="center">
          <p>{t('taxonomyVersions.about')}</p>
          <ButtonContainer>
            <ButtonV2 size="small" onClick={() => setShowNewForm(prev => !prev)}>
              {t('taxonomyVersions.newVersionButton')}
            </ButtonV2>
            {publishRequests?.length ? <DeletePublishRequests nodes={publishRequests} /> : null}
          </ButtonContainer>
        </Row>
        {showNewForm && (
          <FormSpacingWrapper>
            <NewFormWrapper>
              <VersionForm existingVersions={data ?? []} onClose={() => setShowNewForm(false)} />
            </NewFormWrapper>
          </FormSpacingWrapper>
        )}
        <h3>{t('taxonomyVersions.publishedVersion')}</h3>
        {published ? <Version version={published} /> : t('taxonomyVersions.noPublished')}
        <h3>{t('taxonomyVersions.otherVersions')}</h3>
        <VersionList versions={other} />
      </OneColumn>
      <Footer />
    </>
  );
};

export default TaxonomyVersionsPage;
