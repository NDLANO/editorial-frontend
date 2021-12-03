/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FieldHeader, FieldSection, Select } from '@ndla/forms';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { getLicensesWithTranslations } from '../../../util/licenseHelpers';
import { useLicenses } from '../../../modules/draft/draftQueries';

const LicenseField = props => {
  const { onChange, onBlur, name, onFocus, value, disabled, width, enableLicenseNA } = props;
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const licensesWithTranslations = getLicensesWithTranslations(licenses, locale, enableLicenseNA);

  return (
    <>
      <FieldHeader title={t('form.license.label')} width={width}>
        <HowToHelper pageId="userLicense" tooltip={t('form.license.helpLabel')} />
      </FieldHeader>
      <FieldSection>
        <div>
          <Select
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            name={name}>
            {!value && <option>{t('form.license.choose')}</option>}
            {licensesWithTranslations.map(license => (
              <option value={license.license} key={license.license}>
                {license.title}
              </option>
            ))}
          </Select>
        </div>
      </FieldSection>
    </>
  );
};

LicenseField.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  width: PropTypes.number,
  enableLicenseNA: PropTypes.bool,
};

LicenseField.defaultProps = {
  disabled: false,
  name: 'license',
  width: 3 / 4,
};

export default LicenseField;
