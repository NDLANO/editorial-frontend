import { useTranslation } from 'react-i18next';
import { DiffField, DiffInnerField } from './DiffField';
import { DiffResult } from './diffUtils';
import FieldWithTitle from './FieldWithTitle';

interface Props<T = string> {
  fieldName: string;
  result: DiffResult<T | undefined>;
  toDisplayValue: (value: T) => string;
}

const FieldDiff = <T,>({ fieldName, result, toDisplayValue }: Props<T>) => {
  const { t } = useTranslation();
  return (
    <DiffField>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        <DiffInnerField left type={result.diffType}>
          {result.original != null ? toDisplayValue(result.original) : ''}
        </DiffInnerField>
      </FieldWithTitle>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        <DiffInnerField type={result.diffType}>
          {result.other != null ? toDisplayValue(result.other) : ''}
        </DiffInnerField>
      </FieldWithTitle>
    </DiffField>
  );
};

export default FieldDiff;
