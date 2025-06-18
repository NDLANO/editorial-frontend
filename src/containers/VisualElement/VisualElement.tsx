/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { Descendant } from "slate";
import { VisualElementType } from "./VisualElementPicker";
import { audioPlugin } from "../../components/SlateEditor/plugins/audio/audioPlugin";
import { audioRenderer } from "../../components/SlateEditor/plugins/audio/render";
import { EmbedElements } from "../../components/SlateEditor/plugins/embed";
import { externalPlugin, iframePlugin } from "../../components/SlateEditor/plugins/external";
import { externalRenderer } from "../../components/SlateEditor/plugins/external/render";
import { h5pPlugin } from "../../components/SlateEditor/plugins/h5p";
import { h5pRenderer } from "../../components/SlateEditor/plugins/h5p/render";
import { imagePlugin } from "../../components/SlateEditor/plugins/image";
import { imageRenderer } from "../../components/SlateEditor/plugins/image/render";
import { videoPlugin } from "../../components/SlateEditor/plugins/video";
import { videoRenderer } from "../../components/SlateEditor/plugins/video/render";
import VisualElementEditor from "../../components/SlateEditor/VisualElementEditor";

interface Props {
  onChange: (value: Descendant[]) => void;
  types: VisualElementType[];
  language: string;
  value: EmbedElements[];
  allowDecorative?: boolean;
}

const VisualElement = ({ onChange, types, language, value, allowDecorative = false }: Props) => {
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
    ];
  }, [allowDecorative]);

  return <VisualElementEditor types={types} value={value} plugins={plugins} onChange={onChange} language={language} />;
};

export default VisualElement;
