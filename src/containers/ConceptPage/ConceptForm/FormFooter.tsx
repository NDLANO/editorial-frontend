/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { useFormikContext } from 'formik';
import { isFormikFormDirty } from '../../../util/formHelper';
import { fetchStatusStateMachine } from '../../../modules/concept/conceptApi';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { FormikAlertModalWrapper, formClasses, FormikActionButton } from '../../FormikForm';
import { submitFormWithMessage } from '../conceptUtil';
import { ConceptType, CreateMessageType } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';

interface Props {
  entityStatus: { current: string };
  inModal?: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose: () => void;
  onContinue: () => void;
  createMessage: (o: CreateMessageType) => void;
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
  createMessage,
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
              submitFormWithMessage(formikContext, createMessage);
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
          fetchStatusStateMachine={fetchStatusStateMachine}
          showSimpleFooter={showSimpleFooter}
          onSaveClick={() => {
            submitFormWithMessage(formikContext, createMessage);
            //handleSubmit(formikContext);
          }}
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
