/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHandlers, useFormikContext } from "formik";
import { useEffect, useCallback, useState, Ref } from "react";
import { Descendant } from "slate";
import { Slate, Editable, ReactEditor } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import { createSlate } from "@ndla/editor";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps } from "@ndla/styled-system/types";
import { SlatePlugin } from "./interfaces";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { FormikStatus } from "../../interfaces";

const StyledEditable = styled(
  Editable,
  {
    base: {
      outline: "none",
    },
  },
  { baseComponent: true },
);

const StyledPlaceholder = styled("div", {
  base: {
    display: "inline-block",
    width: "0",
    whiteSpace: "nowrap",
    opacity: "0.33",
    pointerEvents: "none",
  },
});

interface Props extends Omit<EditableProps & JsxStyleProps, "value"> {
  ref?: Ref<HTMLDivElement>;
  id: string;
  value: Descendant[];
  onChange: FormikHandlers["handleChange"];
  submitted?: boolean;
  className?: string;
  placeholder?: string;
  plugins?: SlatePlugin[];
  editorId?: string;
}

// TODO: Find a way to properly integrate this with `Field`

const PlainTextEditor = ({
  onChange,
  value,
  id,
  submitted,
  className,
  placeholder,
  plugins,
  editorId,
  ...rest
}: Props) => {
  const [editor] = useState(() => createSlate({ plugins }));

  const onBlur = useCallback(() => {
    ReactEditor.deselect(editor);
  }, [editor]);

  const onSlateChange = useCallback(
    (val: Descendant[]) =>
      onChange({
        target: {
          name: id,
          value: val,
          type: "SlateEditorValue",
        },
      }),
    [id, onChange],
  );

  const { status, setStatus } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    // TODO: Add better logic for refreshing editors when values are changed/set outside of editor scope
    if (status?.status === "revertVersion" || (editorId && status?.status === editorId)) {
      ReactEditor.deselect(editor);
      editor.reinitialize({ value });
      setStatus((prevStatus: FormikStatus) => ({
        ...prevStatus,
        status: undefined,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <Slate editor={editor} initialValue={value} onChange={onSlateChange}>
      <StyledEditable
        // Forcing slate field to be deselected before selecting new field.
        // Fixes a problem where slate field is not properly focused on click.
        onBlur={onBlur}
        onKeyDown={editor.onKeyDown}
        className={className}
        placeholder={placeholder}
        renderPlaceholder={({ children, attributes }) => {
          // Remove inline styling to be able to apply styling from StyledPlaceholder
          const { style, ...remainingAttributes } = attributes;
          return <StyledPlaceholder {...remainingAttributes}>{children}</StyledPlaceholder>;
        }}
        {...rest}
      />
    </Slate>
  );
};

export default PlainTextEditor;
