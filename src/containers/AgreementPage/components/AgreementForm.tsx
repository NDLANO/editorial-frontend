/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikHelpers } from 'formik';
import { Agreement } from '@ndla/icons/editor';
import { IAgreement, IUpdatedAgreement, INewAgreement } from '@ndla/types-draft-api';
import Field from '../../../components/Field';
import { DEFAULT_LICENSE } from '../../../util/formHelper';
import AgreementFields from './AgreementFields';
import { formClasses, ActionButton, AbortButton } from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';
import { Author } from '../../../interfaces';
import { useLicenses } from '../../../modules/draft/draftQueries';

interface AgreementFormValues {
  id?: number;
  title: string;
  content: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  origin: string;
  license: string;
  validFrom?: string;
  validTo?: string;
}

const getInitialValues = (agreement?: IAgreement): AgreementFormValues => ({
  id: agreement?.id,
  title: agreement?.title || '',
  content: agreement?.content || '',
  creators: agreement?.copyright.creators ?? [],
  processors: agreement?.copyright.processors ?? [],
  rightsholders: agreement?.copyright.rightsholders ?? [],
  origin: agreement?.copyright?.origin || '',
  license: agreement?.copyright?.license?.license || DEFAULT_LICENSE.license,
  validFrom: agreement?.copyright?.validFrom,
  validTo: agreement?.copyright?.validTo,
});

const rules = {
  title: {
    required: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  content: {
    required: true,
  },
  validFrom: {
    required: true,

    dateBefore: true,
    afterKey: 'validTo',
  },
  validTo: {
    required: true,
    dateAfter: true,
    beforeKey: 'validFrom',
  },
};

interface Props {
  onUpsert: (agreement: IUpdatedAgreement | INewAgreement, id?: number) => Promise<void>;
  agreement?: IAgreement;
}
const AgreementForm = ({ onUpsert, agreement }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const handleSubmit = async (
    values: AgreementFormValues,
    actions: FormikHelpers<AgreementFormValues>,
  ) => {
    actions.setSubmitting(true);

    const agreementMetaData: IUpdatedAgreement = {
      title: values.title,
      content: values.content,
      copyright: {
        license: licenses!.find(license => license.license === values.license),
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
        validFrom: values.validFrom,
        validTo: values.validTo,
      },
    };
    await onUpsert(agreementMetaData, values.id);
    actions.setSubmitting(false);
  };

  const initVal = getInitialValues(agreement);
  return (
    <Formik
      initialValues={initVal}
      validateOnBlur={false}
      onSubmit={handleSubmit}
      enableReinitialize
      validate={values => validateFormik(values, rules, t)}>
      {({ values, isSubmitting }) => (
        <Form {...formClasses('', 'gray-background')}>
          <div {...formClasses('header', 'other')}>
            <div className="u-4/6@desktop">
              <Agreement />
              <span>
                {values.id ? t('agreementForm.title.update') : t('agreementForm.title.create')}
              </span>
            </div>
          </div>
          <div {...formClasses('content', '', 'u-4/6@desktop u-push-1/6@desktop')}>
            <AgreementFields />
          </div>
          <Field right>
            <AbortButton outline disabled={isSubmitting}>
              {t('form.abort')}
            </AbortButton>
            <ActionButton submit>{t('form.save')}</ActionButton>
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default AgreementForm;
