/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { TextAreaV2 } from '@ndla/forms';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CommentType } from '../../../components/SlateEditor/CommentsProvider';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import { useSession } from '../../Session/SessionProvider';
import { ButtonWrapper, InputAndButtons, textAreaStyles } from './Comment';

const CommentCard = styled.div`
  width: 200px;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: 5px;
  padding: 10px;
  ${fonts.sizes('16px')};
  font-weight: 300;
`;

interface Props {
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const InputComment = ({ comments, setComments, setFieldValue }: Props) => {
  const { t } = useTranslation();
  const { userName } = useSession();
  const [inputValue, setInputValue] = useState('');

  const createComment = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const clicked = () => {
      setInputValue(`\n ${t('form.workflow.addComment.from')} ${userName?.split(' ')[0]}`);

      createComment.current?.setSelectionRange(0, 0);
    };

    const create = createComment?.current;
    if (create) create.addEventListener('click', clicked);

    return () => create?.removeEventListener('click', clicked);
  }, [t, userName]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  const updateComment = () => {
    const updatedComments = [{ content: inputValue }, ...comments];
    setComments(updatedComments);
    setFieldValue('comments', updatedComments);
  };

  return (
    <CommentCard>
      <InputAndButtons>
        <TextAreaV2
          css={textAreaStyles}
          label={t('form.commentField')}
          name={t('form.commentField')}
          placeholder={`${t('form.comment')}...`}
          labelHidden
          value={inputValue}
          onChange={handleInputChange}
          ref={createComment}
        />
        <ButtonWrapper>
          <CancelButton onClick={() => setInputValue('')} disabled={!inputValue} />
          <SaveButton
            flex={2}
            disabled={!inputValue}
            onClick={() => {
              updateComment();
              setInputValue('');
            }}
            text={t('form.comment')}
          />
        </ButtonWrapper>
      </InputAndButtons>
    </CommentCard>
  );
};

export default InputComment;
