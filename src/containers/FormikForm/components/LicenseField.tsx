/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import { FieldHeader, FieldSection, Select } from '@ndla/forms';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { getLicensesWithTranslations } from '../../../util/licenseHelpers';
import { useLicenses } from '../../../modules/draft/draftQueries';

interface Props extends FieldInputProps<string> {
  disabled?: boolean;
  enableLicenseNA?: boolean;
  width?: number;
}

const LicenseField = ({
  onChange,
  onBlur,
  name = 'license',
  value,
  disabled = false,
  width = 3 / 4,
  enableLicenseNA,
}: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const licensesWithTranslations = getLicensesWithTranslations(licenses!, locale, enableLicenseNA);

  return (
    <>
      <FieldHeader title={t('form.license.label')} width={width}>
        <HowToHelper pageId="userLicense" tooltip={t('form.license.helpLabel')} />
      </FieldHeader>
      <FieldSection>
        <div>
          <Select disabled={disabled} value={value} onChange={onChange} onBlur={onBlur} name={name}>
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

export default LicenseField;
