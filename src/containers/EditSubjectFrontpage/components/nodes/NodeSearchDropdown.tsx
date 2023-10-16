/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';

import { Node } from '@ndla/types-taxonomy';

import SearchDropdown from './SearchDropdown';
import { useSearchNodes } from '../../../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  onChange: (t: any) => void;
  selectedItems?: Node[];
  wide?: boolean;
}

const NodeSearchDropdown = ({ onChange, selectedItems, wide }: Props) => {
  const { t } = useTranslation();

  const { taxonomyVersion } = useTaxonomyVersion();
  return (
    <SearchDropdown
      selectedItems={selectedItems}
      id="search-dropdown"
      onChange={onChange}
      placeholder={t('subjectpageForm.addSubject')}
      useQuery={useSearchNodes}
      params={{ taxonomyVersion, nodeType: 'SUBJECT' }}
      transform={(res: any) => {
        return {
          ...res,
          results: res.results.map((r: any) => ({
            originalItem: r,
            id: r.id,
            name: r.name,
            description: r.breadcrumbs?.join(' > '),
            disabled: false,
          })),
        };
      }}
      wide={wide}
    />
  );
};

export default NodeSearchDropdown;
