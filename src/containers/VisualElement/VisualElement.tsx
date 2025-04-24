/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHandlers } from "formik";
import { useMemo } from "react";
import { audioPlugin } from "../../components/SlateEditor/plugins/audio/audioPlugin";
import { audioRenderer } from "../../components/SlateEditor/plugins/audio/render";
import { EmbedElements, embedPlugin } from "../../components/SlateEditor/plugins/embed";
import { embedRenderer } from "../../components/SlateEditor/plugins/embed/render";
import { externalPlugin, iframePlugin } from "../../components/SlateEditor/plugins/external";
import { externalRenderer } from "../../components/SlateEditor/plugins/external/render";
import { h5pPlugin } from "../../components/SlateEditor/plugins/h5p";
import { h5pRenderer } from "../../components/SlateEditor/plugins/h5p/render";
import { imagePlugin } from "../../components/SlateEditor/plugins/image";
import { imageRenderer } from "../../components/SlateEditor/plugins/image/render";
import { videoPlugin } from "../../components/SlateEditor/plugins/video";
import { videoRenderer } from "../../components/SlateEditor/plugins/video/render";
import VisualElementEditor from "../../components/SlateEditor/VisualElementEditor";
import { VisualElementType } from "../../containers/VisualElement/VisualElementMenu";

interface Props {
  onChange: FormikHandlers["handleChange"];
  name: string;
  types: VisualElementType[];
  language: string;
  value: EmbedElements[];
  selectedResource: string;
  resetSelectedResource: () => void;
  allowDecorative?: boolean;
}

const VisualElement = ({
  onChange,
  name,
  types,
  language,
  value,
  selectedResource,
  resetSelectedResource,
  allowDecorative = false,
}: Props) => {
  const plugins = useMemo(() => {
    return [
      audioPlugin.configure({
        options: {
          disableNormalization: true,
        },
      }),
      audioRenderer,
      h5pPlugin.configure({ options: { disableNormalize: true } }),
      h5pRenderer,
      externalPlugin.configure({ options: { disableNormalize: true } }),
      iframePlugin.configure({ options: { disableNormalize: true } }),
      videoPlugin.configure({ options: { disableNormalization: true } }),
      videoRenderer,
      imagePlugin.configure({ options: { disableNormalization: true } }),
      imageRenderer(allowDecorative),
      externalRenderer,
      embedPlugin(true),
      embedRenderer,
    ];
  }, [allowDecorative]);

  return (
    <VisualElementEditor
      types={types}
      name={name}
      value={value}
      plugins={plugins}
      onChange={onChange}
      language={language}
      selectedResource={selectedResource}
      resetSelectedResource={resetSelectedResource}
    />
  );
};

export default VisualElement;
