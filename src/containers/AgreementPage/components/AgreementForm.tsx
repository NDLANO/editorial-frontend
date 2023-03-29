/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Agreement } from '@ndla/icons/editor';
import { colors } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import {
  IAgreement,
  IUpdatedAgreement,
  INewAgreement,
  IAuthor,
} from '@ndla/types-backend/draft-api';
import Field from '../../../components/Field';
import { DEFAULT_LICENSE } from '../../../util/formHelper';
import AgreementFields from './AgreementFields';
import validateFormik from '../../../components/formikValidationSchema';
import { useLicenses } from '../../../modules/draft/draftQueries';
import StyledForm from '../../../components/StyledFormComponents';

interface AgreementFormValues {
  id?: number;
  title: string;
  content: string;
  creators: IAuthor[];
  processors: IAuthor[];
  rightsholders: IAuthor[];
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

const StyledHeaderContainer = styled.div`
  background-color: ${colors.brand.secondary};
  padding: 0.6rem;
  font-size: 1.1rem;
  color: white;

  svg {
    height: 1.2rem;
    width: 1.2rem;
  }

  svg + span {
    margin-left: 1rem;
  }
`;

interface Props {
  onUpsert: (agreement: IUpdatedAgreement | INewAgreement, id?: number) => Promise<void>;
  agreement?: IAgreement;
}
const AgreementForm = ({ onUpsert, agreement }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const navigate = useNavigate();
  const handleSubmit = async (
    values: AgreementFormValues,
    actions: FormikHelpers<AgreementFormValues>,
  ) => {
    actions.setSubmitting(true);

    const agreementMetaData: IUpdatedAgreement = {
      title: values.title,
      content: values.content,
      copyright: {
        license: licenses!.find((license) => license.license === values.license),
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
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ values, isSubmitting }) => (
        <StyledForm>
          <StyledHeaderContainer>
            <div className="u-4/6@desktop">
              <Agreement />
              <span>
                {values.id ? t('agreementForm.title.update') : t('agreementForm.title.create')}
              </span>
            </div>
          </StyledHeaderContainer>
          <div className="u-4/6@desktop u-push-1/6@desktop">
            <AgreementFields />
          </div>
          <Field right>
            <ButtonV2 variant="outline" disabled={isSubmitting} onClick={() => navigate(-1)}>
              {t('form.abort')}
            </ButtonV2>
            <ButtonV2 type="submit">{t('form.save')}</ButtonV2>
          </Field>
        </StyledForm>
      )}
    </Formik>
  );
};

export default AgreementForm;
