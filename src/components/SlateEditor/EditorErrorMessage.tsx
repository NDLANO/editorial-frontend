/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import DeleteButton from "../DeleteButton";

const StyledEditorErrorMessage = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  border: 1px solid ${colors.support.red};
  color: ${colors.support.red};
  padding: 1rem;
`;

interface Props {
  msg: string;
  onRemoveClick?: MouseEventHandler;
  attributes?: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
}

const EditorErrorMessage = ({ msg, attributes, onRemoveClick, children }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledEditorErrorMessage {...attributes} contentEditable={false}>
      <div>
        <span>{msg}</span>
        {children}
      </div>
      {!!onRemoveClick && <DeleteButton aria-label={t("form.remove")} onClick={onRemoveClick} />}
    </StyledEditorErrorMessage>
  );
};

export default EditorErrorMessage;
