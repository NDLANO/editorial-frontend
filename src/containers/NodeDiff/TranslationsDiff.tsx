/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { NodeTranslation } from '../../modules/nodes/nodeApiTypes';
import { DiffField, DiffInnerField } from './DiffField';
import { diffField, DiffResult } from './diffUtils';
import FieldWithTitle from './FieldWithTitle';

interface Props {
  translations: DiffResult<NodeTranslation[]>;
}

type TagType = 'original' | 'other';
type KeyedTranslations = Record<string, { original?: string; other?: string }>;
interface TranslationWithType extends NodeTranslation {
  type: TagType;
}

type DiffedTranslations = Record<string, DiffResult<string>>;

const TranslationsDiff = ({ translations }: Props) => {
  const { t } = useTranslation();
  const originalTranslations: TranslationWithType[] =
    translations.original?.map(t => ({ ...t, type: 'original' })) ?? [];
  const otherTranslations: TranslationWithType[] =
    translations.other?.map(t => ({ ...t, type: 'other' })) ?? [];
  const keyedTranslations = originalTranslations
    .concat(otherTranslations)
    .reduce<KeyedTranslations>((acc, curr) => {
      if (acc[curr.language]) {
        acc[curr.language][curr.type] = curr.name;
      } else {
        acc[curr.language] = {
          [curr.type]: curr.name,
        };
      }
      return acc;
    }, {});

  const diff: DiffedTranslations = Object.entries(keyedTranslations).reduce<DiffedTranslations>(
    (acc, [key, entry]) => {
      acc[key] = diffField(entry.original, entry.other);
      return acc;
    },
    {},
  );

  const keys = Object.keys(diff);
  keys.sort();

  return (
    <DiffField>
      <FieldWithTitle
        title={t('diff.fields.translations.title')}
        key={'diff.fields.translations.left'}>
        {keys.map((key, i) => (
          <DiffInnerField left type={diff[key].diffType} key={`translations-left-${i}`}>
            {diff[key].original && (
              <span>
                <strong>{`${key}: `}</strong>
                <span>{diff[key].original}</span>
              </span>
            )}
          </DiffInnerField>
        ))}
      </FieldWithTitle>
      <FieldWithTitle
        title={t('diff.fields.translations.title')}
        key={'diff.fields.translations.right'}>
        {keys.map((key, i) => (
          <DiffInnerField type={diff[key].diffType} key={`translations-right-${i}`}>
            {diff[key].other && (
              <span>
                <strong>{`${key}: `}</strong>
                <span>{diff[key].other}</span>
              </span>
            )}
          </DiffInnerField>
        ))}
      </FieldWithTitle>
    </DiffField>
  );
};
export default TranslationsDiff;
