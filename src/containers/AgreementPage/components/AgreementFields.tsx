import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { LicenseField, DatePicker, ContributorsField } from '../../FormikForm';
import FormikField from '../../../components/FormikField';

const StyledTwoColumn = styled.div`
  display: flex;
  flex-flow: row;
  margin-top: ${spacing.small};
  & > *:nth-child(1) {
    width: 50%;
  }
  & > *:nth-child(2) {
    margin-left: 0.5rem;
    width: 50%;
  }
`;

const StyledDateField = styled(FormikField)`
  display: inline-block;
  margin-top: 0;
`;
const contributorTypes = ['rightsholders', 'creators'];
const AgreementFields = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <div>
      <FormikField
        label={t('agreementForm.fields.title.label')}
        name="title"
        maxLength={300}
        placeholder={t('agreementForm.fields.title.placeholder')}
      />
      <ContributorsField contributorTypes={contributorTypes} />
      <FormikField name="license">{({ field }) => <LicenseField {...field} />}</FormikField>
      <FormikField label={t('agreementForm.fields.content.label')} name="content">
        {({ field }) => (
          <textarea
            placeholder={t('agreementForm.fields.content.placeholder')}
            rows="15"
            {...field}
          />
        )}
      </FormikField>
      <StyledTwoColumn>
        <StyledDateField name="validFrom">
          {({ field, form }) => (
            <DatePicker
              label={t('form.validDate.from.label')}
              placeholder={t('form.validDate.from.placeholder')}
              locale={locale}
              {...field}
            />
          )}
        </StyledDateField>
        <StyledDateField name="validTo">
          {({ field, form }) => (
            <DatePicker
              placeholder={t('form.validDate.to.placeholder')}
              label={t('form.validDate.to.label')}
              locale={locale}
              {...field}
            />
          )}
        </StyledDateField>
      </StyledTwoColumn>
    </div>
  );
};

export default AgreementFields;
