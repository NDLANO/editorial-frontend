import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import { getLocale } from '../../../modules/locale/locale';
import {
  classes as fieldsClasses,
  TextField,
  TextAreaField,
  DateField,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Contributors from '../../../components/Contributors';
import FormLicense from '../../Form/components/FormLicense';
import { getErrorMessages } from '../../../util/formHelper.js';

const contributorTypes = ['rightsholders', 'creators'];
const AgreementFields = props => {
  const { t, commonFieldProps, licenses, locale } = props;

  return (
    <div>
      <TextField
        label={t('agreementForm.fields.title.label')}
        name="title"
        maxLength={300}
        placeholder={t('agreementForm.fields.title.placeholder')}
        {...commonFieldProps}
      />
      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <Contributors
            name={contributorType}
            label={label}
            showError={commonFieldProps.submitted}
            errorMessages={getErrorMessages(
              label,
              contributorType,
              commonFieldProps.schema,
            )}
            {...commonFieldProps.bindInput(contributorType)}
          />
        );
      })}
      <FormLicense
        licenses={licenses}
        {...commonFieldProps.bindInput('license')}
      />
      <TextAreaField
        label={t('agreementForm.fields.content.label')}
        name="content"
        placeholder={t('agreementForm.fields.content.placeholder')}
        rows="15"
        {...commonFieldProps}
      />
      <div {...fieldsClasses()}>
        <label htmlFor="validFrom and validTo">
          {t('form.validDate.label')}
        </label>
      </div>
      <div {...fieldsClasses('two-column')}>
        <DateField
          name="validFrom"
          locale={locale}
          label={t('form.validDate.from.label')}
          placeholder={t('form.validDate.from.placeholder')}
          {...commonFieldProps}
        />
        <DateField
          name="validTo"
          locale={locale}
          label={t('form.validDate.to.label')}
          placeholder={t('form.validDate.to.placeholder')}
          {...commonFieldProps}
        />
      </div>
    </div>
  );
};

AgreementFields.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(AgreementFields));
