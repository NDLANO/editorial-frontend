/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Select, SingleValue } from '@ndla/select';
import { DropdownWrapper } from '../../styles';

interface Props {
  pageSize: SingleValue;
  setPageSize: (p: SingleValue) => void;
}

const PageSizeDropdown = ({ pageSize, setPageSize }: Props) => {
  const { t } = useTranslation();
  return (
    <DropdownWrapper>
      <Select<false>
        label={t('welcomePage.workList.pickPageSize')}
        options={[
          { label: '6', value: '6' },
          { label: '20', value: '20' },
          { label: '50', value: '50' },
        ]}
        prefix={`${t('welcomePage.workList.numberOfRows')}: `}
        value={pageSize}
        onChange={setPageSize}
        menuPlacement="bottom"
        small
        outline
      />
    </DropdownWrapper>
  );
};

export default PageSizeDropdown;
