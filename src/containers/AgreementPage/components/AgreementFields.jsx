import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LicenseField, DatePicker, ContributorsField } from '../../FormikForm';
import FormikField, { classes as fieldsClasses } from '../../../components/FormikField';

const contributorTypes = ['rightsholders', 'creators'];
const AgreementFields = props => {
  const { t, i18n } = useTranslation();
  const { licenses } = props;
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
      <LicenseField licenses={licenses} />
      <FormikField label={t('agreementForm.fields.content.label')} name="content">
        {({ field }) => (
          <textarea
            placeholder={t('agreementForm.fields.content.placeholder')}
            rows="15"
            {...field}
          />
        )}
      </FormikField>
      <div {...fieldsClasses('two-column')}>
        <FormikField name="validFrom">
          {({ field, form }) => (
            <DatePicker
              label={t('form.validDate.from.label')}
              placeholder={t('form.validDate.from.placeholder')}
              locale={locale}
              {...field}
            />
          )}
        </FormikField>
        <FormikField name="validTo">
          {({ field, form }) => (
            <DatePicker
              placeholder={t('form.validDate.to.placeholder')}
              label={t('form.validDate.to.label')}
              locale={locale}
              {...field}
            />
          )}
        </FormikField>
      </div>
    </div>
  );
};

AgreementFields.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default AgreementFields;
