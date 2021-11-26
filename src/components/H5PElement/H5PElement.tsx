/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@ndla/ui';
import handleError from '../../util/handleError';
import { fetchH5PiframeUrl, editH5PiframeUrl, fetchH5PMetadata } from './h5pApi';

const FlexWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledIFrame = styled.iframe`
  height: 100%;
`;

interface OnSelectObject {
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

const H5PElement = ({
  h5pUrl,
  onSelect,
  onClose,
  locale,
  canReturnResources,
  setH5pFetchFail,
}: Props) => {
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
      setH5pFetchFail && setH5pFetchFail(true);
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
      const metadata = await fetchH5PMetadata(event.data.embed_id);
      const title = metadata.h5p.title;
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
    <FlexWrapper data-cy="h5p-editor">
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

H5PElement.propTypes = {
  h5pUrl: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  canReturnResources: PropTypes.bool,
  setH5pFetchFail: PropTypes.func,
};

export default H5PElement;
