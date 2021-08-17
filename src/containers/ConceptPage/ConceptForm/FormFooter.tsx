/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { isFormikFormDirty } from '../../../util/formHelper';
import { fetchStatusStateMachine } from '../../../modules/concept/conceptApi';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { AlertModalWrapper, formClasses, ActionButton } from '../../FormikForm';
import { ConceptFormValues } from '../conceptInterfaces';
import { ConceptType } from '../../../modules/concept/conceptApiInterfaces';

interface Props {
  entityStatus: { current: string };
  conceptChanged: boolean;
  inModal?: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose: () => void;
  onContinue: () => void;
  getApiConcept: () => ConceptType;
}

const FormFooter = ({
  entityStatus,
  conceptChanged,
  inModal,
  savedToServer,
  isNewlyCreated,
  showSimpleFooter,
  onClose,
  onContinue,
  getApiConcept,
}: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const { values, errors, initialValues, dirty, isSubmitting, submitForm } = formikContext;
  const formIsDirty = isFormikFormDirty({
    values,
    initialValues,
    dirty,
    changed: conceptChanged,
  });

  const disableSave = Object.keys(errors).length > 0;

  return (
    <>
      {inModal ? (
        <Field right>
          <ActionButton outline onClick={onClose}>
            {t('form.abort')}
          </ActionButton>
          <SaveButton
            {...formClasses}
            isSaving={isSubmitting}
            formIsDirty={formIsDirty}
            showSaved={savedToServer && !formIsDirty}
            submit={!inModal}
            disabled={disableSave}
            onClick={(evt: { preventDefault: () => void }) => {
              evt.preventDefault();
              submitForm();
            }}
          />
        </Field>
      ) : (
        <EditorFooter
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getApiConcept}
          entityStatus={entityStatus}
          fetchStatusStateMachine={fetchStatusStateMachine}
          showSimpleFooter={showSimpleFooter}
          onSaveClick={submitForm}
          hideSecondaryButton
          isConcept
          isNewlyCreated={isNewlyCreated}
          validateEntity={() => {}}
          hasErrors={isSubmitting || !formIsDirty || disableSave}
        />
      )}
      {!inModal && (
        <AlertModalWrapper
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          onContinue={onContinue}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      )}
    </>
  );
};

export default FormFooter;
