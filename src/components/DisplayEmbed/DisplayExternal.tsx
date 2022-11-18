/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './helpers/h5pResizer';
import { Transforms, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import styled from '@emotion/styled';
import handleError from '../../util/handleError';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import DisplayExternalModal from './helpers/DisplayExternalModal';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { urlOrigin, getIframeSrcFromHtmlString, urlDomain } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import FigureButtons from '../SlateEditor/plugins/embed/FigureButtons';
import config from '../../config';
import { getH5pLocale } from '../H5PElement/h5pApi';
import { Embed, ExternalEmbed, H5pEmbed } from '../../interfaces';
import { EmbedElement } from '../SlateEditor/plugins/embed';
import SlateResourceBox from './SlateResourceBox';

const ApplyBoxshadow = styled('div')<{ showCopyOutline: boolean }>`
  box-shadow: ${props => props.showCopyOutline && 'rgb(32, 88, 143) 0 0 0 2px'};
`;

type EmbedType = ExternalEmbed | H5pEmbed;

interface Props {
  element: EmbedElement;
  editor: Editor;
  embed: EmbedType;
  onRemoveClick: (event: MouseEvent) => void;
  language: string;
  active: boolean;
  isSelectedForCopy: boolean;
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
  element,
  editor,
  embed,
  onRemoveClick,
  language,
  active,
  isSelectedForCopy,
}: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(false);
  const [properties, setProperties] = useState<EmbedProperties>({ type: embed.resource });
  const { t } = useTranslation();
  const prevEmbed = useRef<EmbedType>(embed);
  const [height, setHeight] = useState(0);
  const iframeWrapper = useRef(null);

  const onMouseDown = useCallback(() => {
    document.addEventListener(
      'mouseup',
      () => {
        if (iframeWrapper.current) {
          const elementHeight = (iframeWrapper.current as HTMLDivElement).clientHeight;
          if (elementHeight) {
            Transforms.setNodes(
              editor,
              { data: { ...prevEmbed.current, height: `${elementHeight}px` } },
              { at: ReactEditor.findPath(editor, element) },
            );
            setHeight(elementHeight);
          }
        }
      },
      { once: true },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPropsFromEmbed = async () => {
    setHeight(0);

    const origin = embed.url ? urlOrigin(embed.url) : config.h5pApiUrl;
    const domain = embed.url ? urlDomain(embed.url) : config.h5pApiUrl;
    const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);

    if (embed.resource === 'external' || embed.resource === 'h5p') {
      try {
        const base = embed.resource === 'h5p' ? `${origin}${embed.path}` : embed.url;
        const url =
          config.h5pApiUrl && base.includes(config.h5pApiUrl)
            ? `${base}?locale=${getH5pLocale(language)}&cssUrl=${cssUrl}`
            : base;

        const data = await fetchExternalOembed(url);
        const src = getIframeSrcFromHtmlString(data.html);

        if (src) {
          setProperties({
            ...properties,
            title: data.title,
            src,
            type: data.type,
            provider: data.providerName,
            height: data.height || '486px',
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
      setProperties({
        ...properties,
        title: domain,
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
      embed.resource === 'h5p' &&
      prevEmbedElement.resource === 'h5p' &&
      embed.path !== prevEmbedElement.path
    ) {
      getPropsFromEmbed();
    } else if (
      (embed.resource === 'external' || embed.resource === 'iframe') &&
      (prevEmbedElement.resource === 'external' || prevEmbedElement.resource === 'iframe') &&
      embed.url !== prevEmbedElement.url
    ) {
      getPropsFromEmbed();
    }
    prevEmbed.current = embed;
  }, [embed]); // eslint-disable-line react-hooks/exhaustive-deps

  const openEditEmbed = (evt: MouseEvent) => {
    evt.preventDefault();
    setIsEditMode(true);
  };

  const closeEditEmbed = () => {
    setIsEditMode(false);
  };

  const onEditEmbed = (properties: Embed) => {
    Transforms.setNodes(
      editor,
      { data: { ...properties } },
      { at: ReactEditor.findPath(editor, element) },
    );
    closeEditEmbed();
  };

  const showCopyOutline = isSelectedForCopy && (!isEditMode || !active);

  const errorHolder = () => (
    <EditorErrorMessage
      onRemoveClick={onRemoveClick}
      msg={
        error
          ? t('displayOembed.errorMessage')
          : t('displayOembed.notSupported', properties.type, properties.provider)
      }
    />
  );

  if (error) {
    return errorHolder();
  }

  // H5P does not provide its name
  const providerName = properties.domain?.includes('h5p') ? 'H5P' : properties.provider;

  const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter(whitelistProvider =>
    properties.type === 'iframe' && properties.domain
      ? whitelistProvider.url.includes(properties.domain)
      : whitelistProvider.name === providerName,
  );

  if (!allowedProvider) {
    return errorHolder();
  }

  if (!properties.src || !properties.type) {
    return <div />;
  }

  return (
    <div className={'c-figure'}>
      <FigureButtons
        language={language}
        tooltip={t('form.external.remove', {
          type: providerName || t('form.external.title'),
        })}
        onRemoveClick={onRemoveClick}
        embed={embed}
        providerName={providerName}
        figureType="external"
        onEdit={
          allowedProvider.name
            ? evt => {
                evt.preventDefault();
                evt.stopPropagation();
                openEditEmbed(evt);
              }
            : undefined
        }
      />
      {(embed.resource === 'iframe' || embed.resource === 'external') &&
      embed.type === 'fullscreen' ? (
        <ApplyBoxshadow showCopyOutline={showCopyOutline}>
          <SlateResourceBox embed={embed} language={language} />
        </ApplyBoxshadow>
      ) : (
        <ApplyBoxshadow
          onMouseDown={onMouseDown}
          ref={iframeWrapper}
          css={[embed.resource === 'iframe' && { resize: 'vertical', overflow: 'hidden' }]}
          showCopyOutline={showCopyOutline}>
          <iframe
            contentEditable={false}
            src={properties.src}
            height={height ? height : properties.height || allowedProvider.height}
            title={properties.title}
            scrolling={properties.type === 'iframe' ? 'no' : undefined}
            allowFullScreen={true}
            frameBorder="0"
          />
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
    </div>
  );
};

export default DisplayExternal;
