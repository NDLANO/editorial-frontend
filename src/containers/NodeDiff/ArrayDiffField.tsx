import { useTranslation } from 'react-i18next';
import { DiffField, DiffInnerField } from './DiffField';
import { DiffResult } from './diffUtils';
import FieldWithTitle from './FieldWithTitle';

interface Props<T> {
  fieldName: string;
  result: DiffResult<T[] | undefined>;
  toDisplayValue: (value: T) => string;
}

const ArrayDiffField = <T,>({ fieldName, result, toDisplayValue }: Props<T>) => {
  const { t } = useTranslation();
  return (
    <DiffField>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        {result.original?.map((res, i) => (
          <DiffInnerField left type={result.diffType} key={`${fieldName}-${i}`}>
            {toDisplayValue(res)}
          </DiffInnerField>
        ))}
      </FieldWithTitle>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        {result.other?.map((res, i) => (
          <DiffInnerField type={result.diffType} key={`${fieldName}-${i}`}>
            {toDisplayValue(res)}
          </DiffInnerField>
        ))}
      </FieldWithTitle>
    </DiffField>
  );
};

export default ArrayDiffField;
