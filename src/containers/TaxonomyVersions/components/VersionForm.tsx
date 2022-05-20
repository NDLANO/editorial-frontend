/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Row } from '../../../components';
import AlertModal from '../../../components/AlertModal';
import Field from '../../../components/Field';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import { VersionType } from '../../../modules/taxonomy/versions/versionApiTypes';
import {
  usePostVersionMutation,
  usePublishVersionMutation,
  usePutVersionMutation,
} from '../../../modules/taxonomy/versions/versionMutations';
import { versionsQueryKey } from '../../../modules/taxonomy/versions/versionQueries';
import { ActionButton } from '../../FormikForm';
import { StyledErrorMessage } from './StyledErrorMessage';
import Fade from '../../../components/Taxonomy/Fade';
import {
  VersionFormType,
  versionFormTypeToVersionPostType,
  versionFormTypeToVersionPutType,
  versionTypeToVersionFormType,
} from '../versionTransformers';
import VersionLockedField from './VersionLockedField';
import VersionNameField from './VersionNameField';
import VersionSourceField from './VersionSourceField';

interface Props {
  version?: VersionType;
  existingVersions: VersionType[];
  onClose: () => void;
}

const versionFormRules: RulesType<VersionFormType> = {
  name: {
    required: true,
  },
};

const StyledTitle = styled.h2`
  padding: 0;
  margin: 0;
`;

const VersionForm = ({ version, existingVersions, onClose }: Props) => {
  const { t } = useTranslation();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const initialValues = versionTypeToVersionFormType(version);
  const qc = useQueryClient();
  const versionsKey = versionsQueryKey();

  const versionPostMutation = usePostVersionMutation({
    onMutate: async ({ body }) => {
      setError(undefined);
      await qc.cancelQueries(versionsKey);
      const optimisticVersion: VersionType = {
        id: '',
        versionType: 'BETA',
        name: body.name,
        hash: '',
        locked: !!body.locked,
      };
      const existingVersions = qc.getQueryData<VersionType[]>(versionsKey) ?? [];
      qc.setQueryData<VersionType[]>(versionsKey, existingVersions.concat(optimisticVersion));
    },
    onSuccess: () => qc.invalidateQueries(versionsKey),
    onError: () => setError(t('taxonomyVersions.postError')),
  });

  const versionPutMutation = usePutVersionMutation({
    onMutate: async ({ id, body }) => {
      setError(undefined);
      await qc.cancelQueries(versionsKey);
      const existingVersions = qc.getQueryData<VersionType[]>(versionsKey) ?? [];
      const newVersions = existingVersions.map(version => {
        if (version.id === id) {
          return {
            ...version,
            locked: body.locked ?? version.locked,
            name: body.name ?? version.name,
          };
        } else return version;
      });
      qc.setQueryData<VersionType[]>(versionsKey, newVersions);
    },
    onSuccess: () => qc.invalidateQueries(versionsKey),
    onError: () => setError(t('taxonomyVersions.putError')),
  });

  const publishVersionMutation = usePublishVersionMutation({
    onMutate: async ({ id }) => {
      setError(undefined);
      await qc.cancelQueries(versionsKey);
      const existingVersions = qc.getQueryData<VersionType[]>(versionsKey) ?? [];
      const updatedVersions: VersionType[] = existingVersions.map(version => {
        if (version.id === id) {
          return { ...version, versionType: 'PUBLISHED' };
        } else return version;
      });
      qc.setQueryData<VersionType[]>(versionsKey, updatedVersions);
    },
    onSuccess: () => qc.invalidateQueries(versionsKey),
    onError: () => setError(t('taxonomyVersions.publishError')),
  });

  const onPublish = async () => {
    if (!version) return;
    await publishVersionMutation.mutateAsync({ id: version.id });
    onClose();
  };

  const onSubmit = async (values: VersionFormType, helpers: FormikHelpers<VersionFormType>) => {
    helpers.setSubmitting(true);
    if (!version) {
      const body = versionFormTypeToVersionPostType(values);
      await versionPostMutation.mutateAsync({
        body,
        sourceId: values.sourceId,
      });
    } else {
      const body = versionFormTypeToVersionPutType(values);
      await versionPutMutation.mutateAsync({ id: version.id, body });
    }
    helpers.setSubmitting(false);
    onClose();
  };
  return (
    <Fade show fadeType="fadeInTop">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validateOnMount={true}
        onSubmit={(values, helpers) => onSubmit(values, helpers)}
        validate={values => validateFormik(values, versionFormRules, t)}>
        {({ isSubmitting, isValid, dirty, handleSubmit }) => {
          return (
            <>
              <StyledTitle>
                {t(`taxonomyVersions.${!version ? 'newVersionTitle' : 'editVersionTitle'}`)}
              </StyledTitle>
              <VersionNameField />
              {!version && <VersionSourceField existingVersions={existingVersions} />}
              {version?.versionType !== 'PUBLISHED' && <VersionLockedField />}
              {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
              <Row>
                <Field>
                  {version && version.versionType === 'BETA' && (
                    <Button disabled={dirty} onClick={() => setShowAlertModal(true)}>
                      {t('taxonomyVersions.publishButton')}
                    </Button>
                  )}
                </Field>
                <Field right>
                  <ActionButton outline onClick={onClose}>
                    {t('form.abort')}
                  </ActionButton>
                  <SaveButton
                    isSaving={isSubmitting}
                    disabled={!dirty || !isValid}
                    onClick={() => handleSubmit()}
                    formIsDirty={dirty}
                  />
                </Field>
              </Row>
              <AlertModal
                show={showAlertModal}
                text={t('taxonomyVersions.publishWarning')}
                actions={[
                  {
                    text: t('form.abort'),
                    onClick: () => setShowAlertModal(false),
                  },
                  {
                    text: t('alertModal.continue'),
                    onClick: () => {
                      setShowAlertModal(false);
                      onPublish();
                    },
                  },
                ]}
                onCancel={() => setShowAlertModal(false)}
              />
            </>
          );
        }}
      </Formik>
    </Fade>
  );
};
export default VersionForm;
