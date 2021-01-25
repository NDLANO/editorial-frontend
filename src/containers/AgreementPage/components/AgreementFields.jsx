import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FormikLicense, FormikDatePicker, FormikContributors } from '../../FormikForm';
import FormikField, { classes as fieldsClasses } from '../../../components/FormikField';
import { LocaleContext } from '../../App/App';

const contributorTypes = ['rightsholders', 'creators'];
const AgreementFields = props => {
  const { t, licenses } = props;
  const locale = useContext(LocaleContext);

  return (
    <div>
      <FormikField
        label={t('agreementForm.fields.title.label')}
        name="title"
        maxLength={300}
        placeholder={t('agreementForm.fields.title.placeholder')}
      />
      <FormikContributors contributorTypes={contributorTypes} />
      <FormikLicense licenses={licenses} />
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
            <FormikDatePicker
              label={t('form.validDate.from.label')}
              placeholder={t('form.validDate.from.placeholder')}
              locale={locale}
              {...field}
            />
          )}
        </FormikField>
        <FormikField name="validTo">
          {({ field, form }) => (
            <FormikDatePicker
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

export default injectT(AgreementFields);
