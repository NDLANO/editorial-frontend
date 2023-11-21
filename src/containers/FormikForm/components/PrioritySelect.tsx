/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { Select, SingleValue } from '@ndla/select';

const priorityMapping = {
  prioritized: 'editorFooter.prioritized',
  'on-hold': 'welcomePage.workList.onHold',
};

interface Props {
  id: string;
  priority: string | undefined;
  updatePriority: (p: SingleValue) => void;
  menuPlacement?: 'top' | 'bottom' | 'auto';
  inModal?: boolean;
}

const PrioritySelect = ({
  id,
  priority,
  updatePriority,
  menuPlacement = 'top',
  inModal = false,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Select<false>
      id={id}
      options={[
        { label: t(priorityMapping['prioritized']), value: 'prioritized' },
        { label: t(priorityMapping['on-hold']), value: 'on-hold' },
      ]}
      menuPlacement={menuPlacement}
      placeholder={t('editorFooter.placeholderPrioritized')}
      label={t('editorFooter.placeholderPrioritized')}
      inModal={inModal}
      value={
        priority === 'prioritized' || priority === 'on-hold'
          ? { value: priority, label: t(priorityMapping[priority!]) }
          : null
      }
      onChange={updatePriority}
      isClearable
      closeMenuOnSelect
    />
  );
};

export default PrioritySelect;
