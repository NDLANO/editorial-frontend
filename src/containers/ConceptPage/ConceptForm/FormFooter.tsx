/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { useFormikContext, FormikContextType } from 'formik';
import { isFormikFormDirty } from '../../../util/formHelper';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { PossibleStatuses } from '../../../components/SlateEditor/editorTypes';
import { FormikAlertModalWrapper, formClasses, FormikActionButton } from '../../FormikForm';
import { ConceptType } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';

interface Props {
  entityStatus: { current: string };
  inModal?: boolean;
  formIsDirty: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose: () => void;
  onContinue: () => void;
  handleSubmit: (formikProps: FormikContextType<ConceptFormValues>) => void;
  createMessage: (o: { translationKey: string; severity: string }) => void;
  getStateStatuses: () => PossibleStatuses;
  getApiConcept: () => ConceptType;
}

const FormFooter = ({
  entityStatus,
  inModal,
  savedToServer,
  isNewlyCreated,
  showSimpleFooter,
  onClose,
  onContinue,
  handleSubmit,
  createMessage,
  getStateStatuses,
  getApiConcept,
  t,
}: Props & tType) => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { values, initialValues, dirty, isSubmitting } = formikContext;
  const formIsDirty = isFormikFormDirty({
    values,
    initialValues,
    dirty,
  });

  return (
    <>
      {inModal ? (
        <Field right>
          <FormikActionButton outline onClick={onClose}>
            {t('form.abort')}
          </FormikActionButton>
          <SaveButton
            {...formClasses}
            isSaving={isSubmitting}
            formIsDirty={formIsDirty}
            showSaved={savedToServer && !formIsDirty}
            submit={!inModal}
            onClick={(evt: { preventDefault: () => void }) => {
              evt.preventDefault();
              handleSubmit(formikContext);
            }}>
            {t('form.save')}
          </SaveButton>
        </Field>
      ) : (
        <EditorFooter
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getApiConcept}
          entityStatus={entityStatus}
          createMessage={createMessage}
          showSimpleFooter={showSimpleFooter}
          onSaveClick={() => {
            handleSubmit(formikContext);
          }}
          getStateStatuses={getStateStatuses}
          hideSecondaryButton
          isConcept
          isNewlyCreated={isNewlyCreated}
          validateEntity={() => {}}
        />
      )}
      {!inModal && (
        <FormikAlertModalWrapper
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

export default injectT(FormFooter);
