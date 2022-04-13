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
