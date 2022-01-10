/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, ReactNode, MouseEvent } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
import './helpers/h5pResizer';
import handleError from '../../util/handleError';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import DisplayExternalModal from './helpers/DisplayExternalModal';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { urlOrigin, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import FigureButtons from '../SlateEditor/plugins/embed/FigureButtons';
import config from '../../config';
import { getH5pLocale } from '../H5PElement/h5pApi';
import { Embed, ExternalEmbed, H5pEmbed } from '../../interfaces';
import { EmbedElement } from '../SlateEditor/plugins/embed';

interface Props extends CustomWithTranslation {
  element: EmbedElement;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  embed: ExternalEmbed | H5pEmbed;
  onRemoveClick: (event: MouseEvent) => void;
  language: string;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

interface State {
  isEditMode: boolean;
  error?: boolean;
  domain?: string;
  src?: string;
  title?: string;
  type?: string;
  height?: number | string;
  provider?: string;
}

export class DisplayExternal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditMode: false,
    };
    this.onEditEmbed = this.onEditEmbed.bind(this);
    this.openEditEmbed = this.openEditEmbed.bind(this);
    this.closeEditEmbed = this.closeEditEmbed.bind(this);
    this.getPropsFromEmbed = this.getPropsFromEmbed.bind(this);
  }

  componentDidMount() {
    this.getPropsFromEmbed();
  }

  componentDidUpdate(prevProps: Props) {
    const { embed } = this.props;
    const { embed: prevEmbed } = prevProps;
    if (prevProps.embed.resource !== embed.resource) {
      this.getPropsFromEmbed();
    } else if (
      embed.resource === 'h5p' &&
      prevEmbed.resource === 'h5p' &&
      embed.path !== prevEmbed.path
    ) {
      this.getPropsFromEmbed();
    } else if (
      (embed.resource === 'external' || embed.resource === 'iframe') &&
      (prevEmbed.resource === 'external' || prevEmbed.resource === 'iframe') &&
      embed.url !== prevEmbed.url
    ) {
      this.getPropsFromEmbed();
    }
  }

  onEditEmbed(properties: Embed) {
    const { editor, element, embed } = this.props;
    const prevUrl = embed.resource === 'external' ? embed.url : undefined;
    const currentUrl = properties.resource === 'external' ? properties.url : undefined;
    const prevPath = embed.resource === 'h5p' ? embed.path : undefined;
    const currentPath = properties.resource === 'h5p' ? properties.path : undefined;

    if (prevUrl !== currentUrl || prevPath !== currentPath) {
      Transforms.setNodes(
        editor,
        { data: { ...properties } },
        { at: ReactEditor.findPath(editor, element) },
      );
      this.closeEditEmbed();
    }
  }

  async getPropsFromEmbed() {
    const { embed, language } = this.props;
    const domain = embed.url ? urlOrigin(embed.url) : config.h5pApiUrl;
    const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
    this.setState({ domain });

    if (embed.resource === 'external' || embed.resource === 'h5p') {
      try {
        const base = embed.resource === 'h5p' ? `${domain}${embed.path}` : embed.url;
        const url =
          config.h5pApiUrl && base.includes(config.h5pApiUrl)
            ? `${base}?locale=${getH5pLocale(language)}&cssUrl=${cssUrl}`
            : base;

        const data = await fetchExternalOembed(url);
        const src = getIframeSrcFromHtmlString(data.html);

        if (src) {
          this.setState({
            title: data.title,
            src,
            type: data.type,
            provider: data.providerName,
            height: data.height || '486px',
          });
        } else {
          this.setState({ error: true });
        }
      } catch (err) {
        this.setState({ error: true });
        handleError(err);
      }
    } else {
      this.setState({
        title: domain,
        src: embed.url,
        type: embed.resource,
        height: embed.height,
      });
    }
  }

  openEditEmbed(evt: MouseEvent) {
    evt.preventDefault();
    this.setState({ isEditMode: true });
  }

  closeEditEmbed() {
    this.setState({ isEditMode: false });
  }

  render() {
    const {
      onRemoveClick,
      embed,
      t,
      language,
      children,
      isSelectedForCopy,
      active,
      attributes,
    } = this.props;
    const { isEditMode, title, src, height, error, type, provider, domain } = this.state;
    const showCopyOutline = isSelectedForCopy && (!isEditMode || !active);

    const errorHolder = () => (
      <EditorErrorMessage
        onRemoveClick={onRemoveClick}
        msg={
          error
            ? t('displayOembed.errorMessage')
            : t('displayOembed.notSupported', {
                type,
                provider,
              })
        }
      />
    );

    if (error) {
      return errorHolder();
    }

    // H5P does not provide its name
    const providerName = domain && domain.includes('h5p') ? 'H5P' : provider;

    const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter(whitelistProvider =>
      type === 'iframe' && domain
        ? whitelistProvider.url.includes(domain)
        : whitelistProvider.name === providerName,
    );

    if (!allowedProvider) {
      return errorHolder();
    }

    if (!src || !type) {
      return <div />;
    }
    return (
      <div
        className="c-figure"
        css={
          showCopyOutline && {
            boxShadow: 'rgb(32, 88, 143) 0 0 0 2px;',
          }
        }
        {...attributes}>
        <FigureButtons
          language={language}
          tooltip={t('form.external.remove', {
            type: providerName || t('form.external.title'),
          })}
          onRemoveClick={onRemoveClick}
          embed={embed}
          providerName={providerName}
          figureType="external"
          onEdit={allowedProvider.name ? evt => this.openEditEmbed(evt) : undefined}
        />
        <iframe
          contentEditable={false}
          src={src}
          height={allowedProvider.height || height}
          title={title}
          scrolling={type === 'iframe' ? 'no' : undefined}
          allowFullScreen={true}
          frameBorder="0"
        />
        <DisplayExternalModal
          isEditMode={isEditMode}
          src={src}
          type={type}
          onEditEmbed={this.onEditEmbed}
          onClose={this.closeEditEmbed}
          allowedProvider={allowedProvider}
        />
        {children}
      </div>
    );
  }
}

export default withTranslation()(DisplayExternal);
