/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHeader, FieldSection, FieldSplitter, Input, Select } from '@ndla/forms';
import { IGlossExample } from '@ndla/types-backend/build/concept-api';
import TranscriptionsField from './TranscriptionsField';
import { LANGUAGES } from '../glossaryData';

interface Props {
  example: IGlossExample;
  index: number;
  onChange: (event: { target: { value: IGlossExample; name: string } }) => void;
  name: string;
}

const Example = ({ example, index, onChange, name }: Props) => {
  const handleExampleChange = (evt: any, fieldName: string) => {
    const target = evt.target ?? evt.currentTarget;

    if (target) {
      const newExample = { ...example, [fieldName]: target.value };
      onChange({
        target: {
          value: newExample,
          name,
        },
      });
    }
  };

  return (
    <>
      <FieldSection>
        <FieldSplitter>
          <Select value={example.language} onChange={(e) => handleExampleChange(e, 'language')}>
            <option value="" />
            {LANGUAGES.map((l, language_index) => (
              <option value={l} key={language_index}>
                {l}
              </option>
            ))}
          </Select>

          <Input
            type="text"
            placeholder={'Example'}
            value={example.example}
            onChange={(e) => handleExampleChange(e, 'example')}
          />
        </FieldSplitter>
      </FieldSection>
      <FieldHeader title={'Transcriptions'} />

      <TranscriptionsField
        name={'transcriptions'}
        values={example.transcriptions}
        onChange={(e) => handleExampleChange(e, 'transcriptions')}
      />
    </>
  );
};

export default Example;
