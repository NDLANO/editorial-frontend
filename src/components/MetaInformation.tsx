/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';

const StyleMetaInformation = styled.div`
  display: flex;
  gap: 2rem;
  margin-left: ${spacing.normal};
`;

const StyledStrong = styled.strong`
  display: block;
`;

interface Props {
  title?: string;
  copyright?: string;
  translations: {
    title: string;
    copyright: string;
  };
  action: ReactNode;
}

const MetaInformation = ({ title, copyright, translations, action }: Props) => (
  <StyleMetaInformation>
    <div>{action || null}</div>
    <div>
      <StyledStrong>{title ? translations.title : ''}</StyledStrong>
      <span>{title}</span>
      <StyledStrong>{copyright ? translations.copyright : ''}</StyledStrong>
      <span>{copyright}</span>
    </div>
  </StyleMetaInformation>
);

MetaInformation.propTypes = {
  title: PropTypes.string,
  copyright: PropTypes.string,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    copyright: PropTypes.string.isRequired,
  }),
  action: PropTypes.node,
};

export default MetaInformation;
