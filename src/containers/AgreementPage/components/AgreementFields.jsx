import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import {
  TextField,
  TextAreaField,
  SelectObjectField,
  DateField,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Contributors from '../../../components/Contributors/Contributors';

const AgreementFields = props => {
  const { t, commonFieldProps, licenses } = props;

  return (
    <div>
      <TextField
        label={t('agreementForm.fields.title.label')}
        name="title"
        maxLength={300}
        placeholder={t('agreementForm.fields.title.placeholder')}
        {...commonFieldProps}
      />
      <Contributors
        name="rightsholders"
        label={t('form.rightsholders.label')}
        {...commonFieldProps}
      />
      <Contributors
        name="creators"
        label={t('form.creators.label')}
        {...commonFieldProps}
      />
      <SelectObjectField
        name="license"
        label={t('form.license.label')}
        options={licenses}
        idKey="license"
        labelKey="description"
        {...commonFieldProps}
      />
      <TextAreaField
        label={t('agreementForm.fields.content.label')}
        name="content"
        placeholder={t('agreementForm.fields.content.placeholder')}
        rows="15"
        {...commonFieldProps}
      />
      <DateField
        name="validTo"
        locale="nb"
        {...commonFieldProps}
      />
    </div>
  );
};

AgreementFields.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
  bindInput: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(AgreementFields);
