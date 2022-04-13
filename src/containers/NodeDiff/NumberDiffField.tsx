import { DiffField, DiffInnerField } from './DiffField';
import { DiffResult } from './diffUtils';
import FieldWithTitle from './FieldWithTitle';

interface Props {
  label: string;
  result: DiffResult<number>;
}

const NumberDiffField = ({ label, result }: Props) => {
  return (
    <DiffField>
      <FieldWithTitle title={label}>
        <DiffInnerField left type={result.diffType}>
          {result.original}
        </DiffInnerField>
      </FieldWithTitle>
      <FieldWithTitle title={label}>
        <DiffInnerField type={result.diffType}>{result.other}</DiffInnerField>
      </FieldWithTitle>
    </DiffField>
  );
};
export default NumberDiffField;
