/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import css from '@emotion/css';

import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import { Input } from '@ndla/forms';
import { Pencil } from '@ndla/icons/action';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { NodeTranslation, NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import { useNodeTranslations } from '../../../../modules/nodes/nodeQueries';
import {
  useDeleteNodeTranslationMutation,
  useUpdateNodeTranslationMutation,
} from '../../../../modules/nodes/nodeMutations';
import { NODE, NODES, NODE_TRANSLATIONS } from '../../../../queryKeys';
import Spinner from '../../../../components/Spinner';
import { StyledErrorMessage } from '../styles';
import { supportedLanguages } from '../../../../i18n2';
import { requiredField } from '../../../../util/yupValidators';
import { isFormikFormDirty } from '../../../../util/formHelper';
import { Row } from '../../../../components';
import { formClasses } from '../../../FormikForm';
import FormikField from '../../../../components/FormikField';
import DeleteButton from '../../../../components/DeleteButton';
import AddNodeTranslation from './AddNodeTranslation';
import SaveButton from '../../../../components/SaveButton';
import UIField from '../../../../components/Field';

const buttonStyle = css`
  flex-grow: 1;
  text-align: center;
  align-items: center;
`;

const cancelButtonStyle = css`
  padding: 0 ${spacing.normal};
`;

const buttonRowStyle = css`
  margin-right: 0px;
`;

const formikFieldStyle = css`
  margin-top: 0px;
`;

interface FormikTranslationFormValues {
  translations: NodeTranslation[];
}

interface Props {
  node: NodeType;
  editModeHandler: EditModeHandler;
}

const ChangeNodeName = ({ editModeHandler: { editMode, toggleEditMode }, node }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <MenuItemButton
        stripped
        data-testid="changeNodeNameButton"
        onClick={() => toggleEditMode('changeSubjectName')}>
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
  const { id, name } = node;

  const { data: translations, isLoading: loading, refetch } = useNodeTranslations(id, {
    onError: e => {
      handleError(e);
      setLoadError(t('taxonomy.changeName.loadError'));
    },
  });
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
      deleteNodeTranslation({ subjectId: id, locale: d.language }),
    );
    const updateCalls = toUpdate.map(([, u]) =>
      updateNodeTranslation({ id, locale: u.language, newTranslation: { name: u.name } }),
    );
    const promises = [...deleteCalls, ...updateCalls];
    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      handleError(e);
      setUpdateError(t('taxonomy.changeName.updateError'));
      qc.invalidateQueries([NODE_TRANSLATIONS, id]);
      qc.invalidateQueries(NODES);
      qc.invalidateQueries([NODE, id]);
      formik.setSubmitting(false);
      return;
    }

    if (promises.length > 0) {
      qc.invalidateQueries(NODES);
      qc.invalidateQueries([NODE, id]);
    }
    await refetch();
    formik.resetForm({ values: formik.values, isSubmitting: false });
    setSaved(true);
  };

  if (loading) {
    return <Spinner />;
  }

  const initialValues = { translations: translations?.slice() ?? [] };

  const schema = yup.object().shape({
    translations: yup.array().of(
      yup.object().shape({
        name: requiredField('taxonomy.changeName.name', t),
        language: requiredField('taxonomy.changeName.language', t),
      }),
    ),
  });

  if (loadError) {
    return <StyledErrorMessage>{loadError}</StyledErrorMessage>;
  }

  return (
    <Modal narrow controllable isOpen backgroundColor="white" onClose={() => onClose()}>
      {(onCloseModal: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={initialValues}
              onSubmit={(_, __) => {}}
              validationSchema={schema}
              enableReinitialize={true}>
              {formik => {
                const { values, dirty, isSubmitting, isValid } = formik;
                const takenLanguages = values.translations.reduce(
                  (prev, curr) => ({ ...prev, [curr.language]: '' }),
                  {},
                );
                const availableLanguages = supportedLanguages.filter(
                  trans => !takenLanguages.hasOwnProperty(trans),
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
                  <Form {...formClasses()}>
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
                              <FormikField
                                css={formikFieldStyle}
                                name={`translations.${i}.name`}
                                label={t(`language.${trans.language}`)}>
                                {({ field }) => (
                                  <Row>
                                    <Input
                                      {...field}
                                      data-testid={`subjectName_${trans.language}`}
                                    />
                                    <DeleteButton
                                      onClick={() => remove(i)}
                                      css={buttonStyle}
                                      data-testid={`subjectName_${trans.language}_delete`}
                                    />
                                  </Row>
                                )}
                              </FormikField>
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
                    <UIField right noBorder css={buttonRowStyle}>
                      <Row justifyContent="end">
                        <Button css={cancelButtonStyle} onClick={onCloseModal}>
                          {t('taxonomy.changeName.cancel')}
                        </Button>
                        <SaveButton
                          data-testid="saveNodeTranslationsButton"
                          large
                          isSaving={isSubmitting}
                          showSaved={!formIsDirty && saved}
                          formIsDirty={formIsDirty}
                          onClick={() => onSubmit(formik)}
                          disabled={!isValid}
                        />
                      </Row>
                    </UIField>
                    {updateError && <StyledErrorMessage>{updateError}</StyledErrorMessage>}
                  </Form>
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
