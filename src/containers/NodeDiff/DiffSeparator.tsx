/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DiffResultType } from './diffUtils';

interface Props {
  type: DiffResultType;
}

const typeToSeparatorMap: Record<DiffResultType, string> = {
  ADDED: '+',
  DELETED: '-',
  MODIFIED: '~',
  NONE: '',
};

const DiffSeparator = ({ type }: Props) => {
  return <>{typeToSeparatorMap[type]}</>;
};

export default DiffSeparator;
