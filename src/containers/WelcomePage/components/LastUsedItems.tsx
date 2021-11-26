/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LastUsed } from '@ndla/icons/editor';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classes } from '../WelcomePage';
import LastUsedContent from './LastUsedContent';

interface Props {
  lastUsed?: string[];
}

const LastUsedItems = ({ lastUsed }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <div {...classes('column-header')}>
        <LastUsed className="c-icon--medium" />
        <span>{t('welcomePage.lastUsed')}</span>
      </div>
      {lastUsed?.length ? (
        lastUsed.map((result: string) => {
          return <LastUsedContent key={result} articleId={parseInt(result)} />;
        })
      ) : (
        <span>{t('welcomePage.emptyLastUsed')}</span>
      )}
    </div>
  );
};

export default memo(LastUsedItems);
