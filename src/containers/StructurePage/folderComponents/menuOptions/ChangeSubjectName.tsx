/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import css from '@emotion/css';

import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import { Input } from '@ndla/forms';
import { Pencil } from '@ndla/icons/action';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';

import RoundIcon from '../../../../components/RoundIcon';
import {
  deleteSubjectNameTranslation,
  fetchSubjectNameTranslations,
  updateSubjectNameTranslation,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import { SubjectNameTranslation } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { EditMode } from '../../../../interfaces';
import { Row } from '../../../../components';
import SaveButton from '../../../../components/SaveButton';
import FormikField from '../../../../components/FormikField';
import Spinner from '../../../../components/Spinner';
import { formClasses } from '../../../FormikForm';
import { isFormikFormDirty } from '../../../../util/formHelper';
import UIField from '../../../../components/Field';
import { supportedLanguages } from '../../../../i18n2';
import { requiredField } from '../../../../util/yupValidators';
import DeleteButton from '../../../../components/DeleteButton';
import AddSubjectTranslation from './AddSubjectTranslation';
import handleError from '../../../../util/handleError';
import { StyledErrorMessage } from '../styles';

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
  translations: SubjectNameTranslation[];
}

interface Props {
  toggleEditMode: (s: EditMode) => void;
  onClose: () => void;
  editMode: string;
  name: string;
  id: string;
  contentUri?: string;
  getAllSubjects: () => Promise<void>;
  refreshTopics: () => void;
}

const ChangeSubjectName = ({
  toggleEditMode,
  onClose,
  editMode,
  id,
  getAllSubjects,
  refreshTopics,
  name,
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <MenuItemButton
        stripped
        data-testid="changeSubjectNameButton"
        onClick={() => toggleEditMode('changeSubjectName')}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.changeName.buttonTitle')}
      </MenuItemButton>
      {editMode === 'changeSubjectName' && (
        <ChangeSubjectNameModal
          name={name}
          getAllSubjects={getAllSubjects}
          refreshTopics={refreshTopics}
          onClose={() => {
            toggleEditMode('changeSubjectName');
          }}
          id={id}
        />
      )}
    </>
  );
};

interface ModalProps {
  onClose: () => void;
  refreshTopics: () => void;
  getAllSubjects: () => Promise<void>;
  id: string;
  name: string;
}

const ChangeSubjectNameModal = ({
  onClose,
  id,
  name,
  refreshTopics,
  getAllSubjects,
}: ModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [translations, setTranslations] = useState<SubjectNameTranslation[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const translations = await fetchSubjectNameTranslations(id);
        setTranslations(translations);
      } catch (e) {
        handleError(e);
        setLoadError(t('taxonomy.changeName.loadError'));
      }
      setLoading(false);
    })();
  }, [id, t]);

  const toRecord = (
    translations: SubjectNameTranslation[],
  ): Record<string, SubjectNameTranslation> =>
    translations.reduce((prev, curr) => ({ ...prev, [curr.language]: curr }), {});

  const onSubmit = async (formik: FormikProps<FormikTranslationFormValues>) => {
    formik.setSubmitting(true);
    const initial = toRecord(formik.initialValues.translations);
    const newValues = toRecord(formik.values.translations);

    const deleted = Object.entries(initial).filter(([key]) => !newValues[key]);
    const toUpdate = Object.entries(newValues).filter(([key, value]) => value !== initial[key]);

    const deleteCalls = deleted.map(([, d]) => deleteSubjectNameTranslation(id, d.language));
    const updateCalls = toUpdate.map(([, u]) =>
      updateSubjectNameTranslation(id, u.language, u.name),
    );
    const promises = [...deleteCalls, ...updateCalls];
    try {
      await Promise.all(promises);
    } catch (e) {
      handleError(e);
      setUpdateError(t('taxonomy.changeName.updateError'));
      await getAllSubjects();
      refreshTopics();
      formik.setSubmitting(false);
      return;
    }

    if (promises.length > 0) {
      await getAllSubjects();
      refreshTopics();
    }
    setTranslations(formik.values.translations);
    formik.resetForm({ values: formik.values, isSubmitting: false });
    setSaved(true);
  };

  const initialValues = { translations: translations.slice() };
  const [saved, setSaved] = useState(false);

  const schema = yup.object().shape({
    translations: yup.array().of(
      yup.object().shape({
        name: requiredField('taxonomy.changeName.name', t),
        language: requiredField('taxonomy.changeName.language', t),
      }),
    ),
  });

  if (loading) {
    return <Spinner />;
  }

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
              enableReinitialize={false}>
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
                          <AddSubjectTranslation
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
                          data-testid="saveSubjectTranslationsButton"
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

export default ChangeSubjectName;
