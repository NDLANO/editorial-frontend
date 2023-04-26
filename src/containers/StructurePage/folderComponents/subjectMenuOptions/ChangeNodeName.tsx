/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FieldArray, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Input } from '@ndla/forms';
import { Pencil } from '@ndla/icons/action';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { NodeTranslation, NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import {
  nodeQueryKey,
  nodesQueryKey,
  nodeTranslationsQueryKey,
  useNodeTranslations,
} from '../../../../modules/nodes/nodeQueries';
import {
  useDeleteNodeTranslationMutation,
  useUpdateNodeTranslationMutation,
} from '../../../../modules/nodes/nodeMutations';
import Spinner from '../../../../components/Spinner';
import { StyledErrorMessage } from '../styles';
import { subjectpageLanguages } from '../../../../i18n2';
import { isFormikFormDirty } from '../../../../util/formHelper';
import { Row } from '../../../../components';
import FormikField from '../../../../components/FormikField';
import DeleteButton from '../../../../components/DeleteButton';
import AddNodeTranslation from './AddNodeTranslation';
import SaveButton from '../../../../components/SaveButton';
import UIField from '../../../../components/Field';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import StyledForm from '../../../../components/StyledFormComponents';
import validateFormik, { RulesType } from '../../../../components/formikValidationSchema';

const StyledDeleteButton = styled(DeleteButton)`
  flex-grow: 1;
  text-align: center;
  align-items: center;
`;

const StyledCancelButton = styled(ButtonV2)`
  padding: 0 ${spacing.normal};
`;

const StyledUIField = styled(UIField)`
  margin-right: 0px;
`;

const StyledFormikField = styled(FormikField)`
  margin-top: 0px;
`;

interface FormikTranslationFormValues {
  translations: NodeTranslation[];
}

interface Props {
  node: NodeType;
  editModeHandler: EditModeHandler;
}

const rules: RulesType<NodeTranslation, NodeTranslation> = {
  name: {
    required: true,
  },
  language: {
    required: true,
  },
};

const ChangeNodeName = ({ editModeHandler: { editMode, toggleEditMode }, node }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <MenuItemButton
        data-testid="changeNodeNameButton"
        onClick={() => toggleEditMode('changeSubjectName')}
      >
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.changeName.buttonTitle')}
      </MenuItemButton>
      {editMode === 'changeSubjectName' && (
        <ChangeNodeNameModal node={node} onClose={() => toggleEditMode('changeSubjectName')} />
      )}
    </>
  );
};

interface ModalProps {
  onClose: () => void;
  node: NodeType;
}

const ChangeNodeNameModal = ({ onClose, node }: ModalProps) => {
  const { t } = useTranslation();
  const [loadError, setLoadError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [saved, setSaved] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { id, name } = node;

  const {
    data: translations,
    isInitialLoading: loading,
    refetch,
  } = useNodeTranslations(
    { id, taxonomyVersion },
    {
      onError: (e) => {
        handleError(e);
        setLoadError(t('taxonomy.changeName.loadError'));
      },
    },
  );
  const { mutateAsync: deleteNodeTranslation } = useDeleteNodeTranslationMutation();
  const { mutateAsync: updateNodeTranslation } = useUpdateNodeTranslationMutation();
  const qc = useQueryClient();

  const toRecord = (translations: NodeTranslation[]): Record<string, NodeTranslation> =>
    translations.reduce((prev, curr) => ({ ...prev, [curr.language]: curr }), {});

  const onSubmit = async (formik: FormikProps<FormikTranslationFormValues>) => {
    formik.setSubmitting(true);
    const initial = toRecord(formik.initialValues.translations);
    const newValues = toRecord(formik.values.translations);

    const deleted = Object.entries(initial).filter(([key]) => !newValues[key]);
    const toUpdate = Object.entries(newValues).filter(([key, value]) => value !== initial[key]);

    const deleteCalls = deleted.map(([, d]) =>
      deleteNodeTranslation({ id, language: d.language, taxonomyVersion }),
    );
    const updateCalls = toUpdate.map(([, u]) =>
      updateNodeTranslation({
        id,
        language: u.language,
        body: { name: u.name },
        taxonomyVersion,
      }),
    );
    const promises = [...deleteCalls, ...updateCalls];
    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      handleError(e);
      setUpdateError(t('taxonomy.changeName.updateError'));
      qc.invalidateQueries(nodeTranslationsQueryKey({ id }));
      qc.invalidateQueries(nodesQueryKey({ isRoot: true, taxonomyVersion }));
      qc.invalidateQueries(nodeQueryKey({ id }));
      formik.setSubmitting(false);
      return;
    }

    if (promises.length > 0) {
      qc.invalidateQueries(nodesQueryKey({ isRoot: true, taxonomyVersion }));
      qc.invalidateQueries(nodeQueryKey({ id }));
    }
    await refetch();
    formik.resetForm({ values: formik.values, isSubmitting: false });
    setSaved(true);
  };

  if (loading) {
    return <Spinner />;
  }

  const initialValues = { translations: translations?.slice() ?? [] };

  if (loadError) {
    return <StyledErrorMessage>{loadError}</StyledErrorMessage>;
  }

  return (
    <Modal
      label={t('taxonomy.changeName.title')}
      narrow
      controllable
      isOpen
      backgroundColor="white"
      onClose={() => onClose()}
    >
      {(onCloseModal: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={initialValues}
              onSubmit={(_, __) => {}}
              validate={(values) => {
                const errors = values.translations.map((translation) =>
                  validateFormik(translation, rules, t),
                );
                if (errors.some((err) => Object.keys(err).length > 0)) {
                  return { translations: errors };
                }
              }}
              enableReinitialize={true}
            >
              {(formik) => {
                const { values, dirty, isSubmitting, isValid } = formik;
                const takenLanguages = values.translations.reduce(
                  (prev, curr) => ({ ...prev, [curr.language]: '' }),
                  {},
                );
                const availableLanguages = subjectpageLanguages.filter(
                  (trans) => !Object.prototype.hasOwnProperty.call(takenLanguages, trans),
                );
                const formIsDirty: boolean = isFormikFormDirty({
                  values,
                  initialValues,
                  dirty,
                });

                if (formIsDirty) {
                  setUpdateError('');
                  setSaved(false);
                }
                return (
                  <StyledForm>
                    <h1>{t('taxonomy.changeName.title')}</h1>
                    <p>{`${t('taxonomy.changeName.defaultName')}: ${name}`}</p>
                    {values.translations.length === 0 && (
                      <>{t('taxonomy.changeName.noTranslations')}</>
                    )}
                    <FieldArray name="translations">
                      {({ push, remove }) => (
                        <>
                          {values.translations.map((trans, i) => (
                            <Row key={i}>
                              <StyledFormikField
                                name={`translations.${i}.name`}
                                label={t(`language.${trans.language}`)}
                              >
                                {({ field }) => (
                                  <Row>
                                    <Input
                                      {...field}
                                      data-testid={`subjectName_${trans.language}`}
                                    />
                                    <StyledDeleteButton
                                      aria-label={t('form.remove')}
                                      onClick={() => remove(i)}
                                      data-testid={`subjectName_${trans.language}_delete`}
                                    />
                                  </Row>
                                )}
                              </StyledFormikField>
                            </Row>
                          ))}
                          <AddNodeTranslation
                            defaultName={name}
                            onAddTranslation={push}
                            availableLanguages={availableLanguages}
                          />
                        </>
                      )}
                    </FieldArray>
                    <StyledUIField right noBorder>
                      <Row justifyContent="end">
                        <StyledCancelButton onClick={onCloseModal}>
                          {t('taxonomy.changeName.cancel')}
                        </StyledCancelButton>
                        <SaveButton
                          data-testid="saveNodeTranslationsButton"
                          size="large"
                          isSaving={isSubmitting}
                          showSaved={!formIsDirty && saved}
                          formIsDirty={formIsDirty}
                          onClick={() => onSubmit(formik)}
                          disabled={!isValid}
                        />
                      </Row>
                    </StyledUIField>
                    {updateError && <StyledErrorMessage>{updateError}</StyledErrorMessage>}
                  </StyledForm>
                );
              }}
            </Formik>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default ChangeNodeName;
