/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, useRef, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { Transforms, Editor, Path } from "slate";
import { RenderElementProps } from "slate-react";
import "./helpers/h5pResizer";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever, Expandable } from "@ndla/icons/editor";
import DisplayExternalModal from "./helpers/DisplayExternalModal";
import SlateResourceBox from "./SlateResourceBox";
import config from "../../config";
import { EXTERNAL_WHITELIST_PROVIDERS } from "../../constants";
import { Embed, ExternalEmbed, H5pEmbed } from "../../interfaces";
import { fetchExternalOembed } from "../../util/apiHelpers";
import handleError from "../../util/handleError";
import { urlOrigin, getIframeSrcFromHtmlString, urlDomain } from "../../util/htmlHelpers";
import { getH5pLocale } from "../H5PElement/h5pApi";
import EditorErrorMessage from "../SlateEditor/EditorErrorMessage";
import { StyledDeleteEmbedButton, StyledFigureButtons } from "../SlateEditor/plugins/embed/FigureButtons";

const ApplyBoxshadow = styled.div`
  &[data-show-copy-outline="true"] {
    box-shadow: rgb(32, 88, 143) 0 0 0 2px;
  }
`;

const ExpandableButton = styled.div`
  position: absolute;
  bottom: 0px;
  right: 23px;
  cursor: pointer;
`;

type EmbedType = ExternalEmbed | H5pEmbed;

interface Props extends HTMLAttributes<HTMLDivElement> {
  pathToEmbed: Path;
  editor: Editor;
  embed: EmbedType;
  onRemoveClick: (event: React.MouseEvent) => void;
  language: string;
  active: boolean;
  isSelectedForCopy: boolean;
  attributes?: RenderElementProps["attributes"];
}

interface EmbedProperties {
  domain?: string;
  src?: string;
  title?: string;
  type?: string;
  height?: number | string;
  provider?: string;
}

const DisplayExternal = ({
  pathToEmbed,
  editor,
  embed,
  onRemoveClick,
  language,
  active,
  isSelectedForCopy,
  attributes,
  children,
}: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(false);
  const [properties, setProperties] = useState<EmbedProperties>({
    type: embed.resource,
  });
  const { t } = useTranslation();
  const prevEmbed = useRef<EmbedType>(embed);
  const [height, setHeight] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const iframeWrapper = useRef(null);

  const getPropsFromEmbed = async () => {
    const origin = embed.url ? urlOrigin(embed.url) : config.h5pApiUrl;
    const domain = embed.url ? urlDomain(embed.url) : config.h5pApiUrl;
    const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);

    if (embed.resource === "external" || embed.resource === "h5p") {
      try {
        const base = embed.resource === "h5p" ? `${origin}${embed.path}` : embed.url;
        const url =
          config.h5pApiUrl && base.includes(config.h5pApiUrl)
            ? `${base}?locale=${getH5pLocale(language)}&cssUrl=${cssUrl}`
            : base;

        const data = await fetchExternalOembed(url);
        const src = getIframeSrcFromHtmlString(data.html);

        if (src) {
          setHeight(0);
          setProperties({
            ...properties,
            title: embed.title?.length ? embed.title : data.title,
            src,
            type: data.type,
            provider: data.providerName,
            height: data.height || "486px",
            domain: domain,
          });
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
        handleError(err);
      }
    } else {
      // Update height if height of inserted element changes - otherwise reset height
      if (embed.height && prevEmbed.current.url === embed.url) {
        setHeight(Number(embed.height.replace(/\D/g, "")));
      } else {
        setHeight(0);
      }
      setProperties({
        ...properties,
        title: embed.title?.length ? embed.title : domain,
        src: embed.url,
        type: embed.resource,
        height: embed.height,
        domain: domain,
      });
    }
  };

  useEffect(() => {
    getPropsFromEmbed();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const prevEmbedElement: EmbedType = prevEmbed.current;

    if (prevEmbedElement.resource !== embed.resource) {
      getPropsFromEmbed();
    } else if (
      embed.resource === "h5p" &&
      prevEmbedElement.resource === "h5p" &&
      embed.path !== prevEmbedElement.path
    ) {
      getPropsFromEmbed();
    } else if (
      (embed.resource === "external" || embed.resource === "iframe") &&
      (prevEmbedElement.resource === "external" || prevEmbedElement.resource === "iframe") &&
      embed.url !== prevEmbedElement.url
    ) {
      getPropsFromEmbed();
    } else if (embed.title !== prevEmbedElement.title) {
      getPropsFromEmbed();
    }
    prevEmbed.current = embed;
  }, [embed]); // eslint-disable-line react-hooks/exhaustive-deps

  const openEditEmbed = (evt: React.MouseEvent) => {
    evt.preventDefault();
    setIsEditMode(true);
  };

  const closeEditEmbed = () => {
    setIsEditMode(false);
  };
  const onEditEmbed = (embedUpdates: Embed) => {
    Transforms.setNodes(editor, { data: { ...embedUpdates } }, { at: pathToEmbed });
    closeEditEmbed();
  };

  const showCopyOutline = isSelectedForCopy && (!isEditMode || !active);

  const errorHolder = () => (
    <EditorErrorMessage
      onRemoveClick={onRemoveClick}
      msg={
        error
          ? t("displayOembed.errorMessage")
          : t("displayOembed.notSupported", {
              type: properties.type,
              provider: properties.provider,
            })
      }
    />
  );

  if (error) {
    return errorHolder();
  }

  // H5P does not provide its name
  const providerName = properties.domain?.includes("h5p") ? "H5P" : properties.provider;

  const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter((whitelistProvider) =>
    properties.type === "iframe" && properties.domain
      ? whitelistProvider.url.includes(properties.domain)
      : whitelistProvider.name === providerName,
  );

  if (!allowedProvider) {
    return errorHolder();
  }

  if (!properties.src || !properties.type) {
    return <div />;
  }

  const handleResize = (mouseDownEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startSize = height;
    const startPosition = mouseDownEvent.pageY;
    const minHeight = 100;

    setIsResizing(true);

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const elementHeight = startSize - startPosition + mouseMoveEvent.pageY;
      setHeight(elementHeight > minHeight ? elementHeight : minHeight);
    };

    const onMouseUp = (mouseUpEvent: MouseEvent) => {
      document.body.removeEventListener("mousemove", onMouseMove);
      const elementHeight = startSize - startPosition + mouseUpEvent.pageY;
      const updatedElementHeight = elementHeight > minHeight ? elementHeight : minHeight;

      const newData = {
        ...prevEmbed.current,
        height: `${updatedElementHeight}px`,
      };

      Transforms.setNodes(editor, { data: newData }, { at: pathToEmbed });
      setHeight(updatedElementHeight);
      setIsResizing(false);
    };

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <div {...attributes} className={"c-figure"} contentEditable={false}>
      <StyledFigureButtons data-white={true}>
        {allowedProvider.name && (
          <IconButtonV2
            aria-label={t("form.external.edit", {
              type: providerName || t("form.external.title"),
            })}
            title={t("form.external.edit", {
              type: providerName || t("form.external.title"),
            })}
            colorTheme="light"
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              openEditEmbed(evt);
            }}
          >
            <Pencil />
          </IconButtonV2>
        )}
        <StyledDeleteEmbedButton
          aria-label={t("form.external.remove", {
            type: providerName || t("form.external.title"),
          })}
          title={t("form.external.remove", {
            type: providerName || t("form.external.title"),
          })}
          colorTheme="danger"
          onClick={onRemoveClick}
          data-testid="remove-element"
        >
          <DeleteForever />
        </StyledDeleteEmbedButton>
      </StyledFigureButtons>
      {(embed.resource === "iframe" || embed.resource === "external") && embed.type === "fullscreen" ? (
        <ApplyBoxshadow data-show-copy-outline={showCopyOutline}>
          <SlateResourceBox embed={embed} language={language} />
        </ApplyBoxshadow>
      ) : (
        <ApplyBoxshadow
          ref={iframeWrapper}
          data-show-copy-outline={showCopyOutline}
          style={{ pointerEvents: isResizing ? "none" : "auto" }}
        >
          <iframe
            contentEditable={false}
            src={properties.src}
            height={height ? height : allowedProvider.height || properties.height}
            title={properties.title}
            scrolling={properties.type === "iframe" ? "no" : undefined}
            allowFullScreen={true}
            frameBorder="0"
          />
          {embed.resource === "iframe" && (
            <ExpandableButton role="button" onMouseDown={handleResize} aria-label={t("form.resize")}>
              <Expandable />
            </ExpandableButton>
          )}
        </ApplyBoxshadow>
      )}
      <DisplayExternalModal
        embed={embed}
        isEditMode={isEditMode}
        src={properties.src}
        type={properties.type}
        onEditEmbed={onEditEmbed}
        onClose={closeEditEmbed}
        allowedProvider={allowedProvider}
      />
      {children}
    </div>
  );
};

export default DisplayExternal;
