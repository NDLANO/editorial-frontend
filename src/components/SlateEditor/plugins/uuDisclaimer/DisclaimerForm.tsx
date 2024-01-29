/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';

const DISCLAIMER_EXAMPLES_LINK =
  'https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit?usp=sharing';

const DisclaimerForm = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Text element="p" textStyle="meta-text-medium" margin="small">
        <b>{t('form.disclaimer.exampleHeader')}</b>
      </Text>
      <Text element="p" textStyle="meta-text-small" margin="none">
        {t('form.disclaimer.exampleText')}
      </Text>
      <Text element="p" textStyle="meta-text-small">
        <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t('form.disclaimer.exampleLinkText')}</SafeLink>
      </Text>
      <Text element="p" textStyle="meta-text-medium" margin="small">
        <b>{t('form.disclaimer.editorHeader')}</b>
      </Text>
    </div>
  );
};

export default DisclaimerForm;
