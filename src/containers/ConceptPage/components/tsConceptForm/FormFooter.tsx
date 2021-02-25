import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FormikProps } from 'formik';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import SaveButton from '../../../../components/SaveButton';
import Field from '../../../../components/Field';
import { FormikAlertModalWrapper, formClasses, FormikActionButton } from '../../../FormikForm';
import { Article, PossibleStatuses, Values } from '../../../../components/SlateEditor/editorTypes';
import { ConceptType } from '../../../../interfaces';

interface Props {
  formikProps: FormikProps<Values>;
  entityStatus: { current: string };
  inModal: boolean;
  formIsDirty: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose: () => void;
  onContinue: () => void;
  handleSubmit: (values: unknown) => void;
  createMessage: (o: { translationKey: string; severity: string }) => void;
  getStateStatuses: () => PossibleStatuses;
  getApiConcept: (values: Values) => Article | ConceptType;
}

const FormFooter = ({
  formikProps,
  entityStatus,
  inModal,
  formIsDirty,
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
  const { values, isSubmitting } = formikProps;

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
            onClick={evt => {
              evt.preventDefault();
              handleSubmit(formikProps);
            }}>
            {t('form.save')}
          </SaveButton>
        </Field>
      ) : (
        <EditorFooter
          formikProps={formikProps}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={() => getApiConcept(values)}
          entityStatus={entityStatus}
          createMessage={createMessage}
          showSimpleFooter={showSimpleFooter}
          onSaveClick={() => {
            handleSubmit(formikProps);
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
