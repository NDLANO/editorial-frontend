/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ErrorMessage } from '@ndla/ui';
import { fetchH5PiframeUrl, editH5PiframeUrl, fetchH5PInfo } from './h5pApi';
import handleError from '../../util/handleError';

const FlexWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;

const StyledIFrame = styled.iframe`
  flex: 1;
  overflow: hidden;
`;

export interface OnSelectObject {
  path?: string;
  title?: string;
}

interface Props {
  h5pUrl?: string;
  onSelect: (selected: OnSelectObject) => void;
  onClose: () => void;
  locale: string;
  canReturnResources?: boolean;
  setH5pFetchFail?: (failed: boolean) => void;
}

interface MessageEvent extends Event {
  data: {
    embed_id: string;
    oembed_url: string;
    messageType?: string;
    type?: string;
  };
}

const H5PElement = ({ h5pUrl, onSelect, onClose, locale, canReturnResources }: Props) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>('');
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('message', handleH5PChange);
    window.addEventListener('message', handleH5PClose);
    try {
      fetchAndSetH5PUrl();
    } catch (e) {
      setFetchFailed(true);
    }

    return () => {
      window.removeEventListener('message', handleH5PChange);
      window.removeEventListener('message', handleH5PClose);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAndSetH5PUrl = async () => {
    const data = h5pUrl
      ? await editH5PiframeUrl(h5pUrl, locale)
      : await fetchH5PiframeUrl(locale, canReturnResources);
    setUrl(data.url);
  };

  const handleH5PChange = async (event: MessageEvent) => {
    if (event.data.type !== 'h5p') {
      return;
    }
    // Currently, we need to strip oembed part of H5P-url to support NDLA proxy oembed service
    const { oembed_url: oembedUrl } = event.data;
    const url = oembedUrl.match(/url=([^&]*)/)?.[0].replace('url=', '');
    const path = url?.replace(/https?:\/\/h5p.{0,8}.ndla.no/, '');
    try {
      const metadata = await fetchH5PInfo(event.data.embed_id);
      const title = metadata.title;
      onSelect({ path, title });
    } catch (e) {
      onSelect({ path });
      handleError(e);
    }
  };

  const handleH5PClose = async (event: MessageEvent) => {
    if (event.data.messageType !== 'closeEdlibModal') {
      return;
    }
    onClose();
  };

  return (
    <FlexWrapper data-testid="h5p-editor">
      {fetchFailed && (
        <ErrorMessage
          illustration={{
            url: '/Oops.gif',
            altText: t('errorMessage.title'),
          }}
          messages={{
            title: t('errorMessage.title'),
            description: t('h5pElement.fetchError'),
            back: t('errorMessage.back'),
            goToFrontPage: t('errorMessage.goToFrontPage'),
          }}
        />
      )}
      {url && <StyledIFrame src={url} title="H5P" frameBorder="0" />}
    </FlexWrapper>
  );
};

export default H5PElement;
