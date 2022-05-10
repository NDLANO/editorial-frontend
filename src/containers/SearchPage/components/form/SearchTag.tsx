/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, MouseEvent } from 'react';

import PropTypes from 'prop-types';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
import { colors, spacing } from '@ndla/core';
import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import styled from '@emotion/styled';

export type MinimalTagType = {
  name?: string;
  type: string;
};

const StyledDl = styled.dl`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 1.9rem;
  width: auto;
  border-radius: 1px;
  background-color: ${colors.background.dark};
  color: #5c5c5c;
  line-height: 1rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  margin: 0.1rem 0.3rem;
  margin-right: ${spacing.small};
  &:first-child {
    margin-left: 0;
  }
`;

const StyledDt = styled.dt`
  font-weight: 800;
  font-size: 0.8em;
  color: ${colors.black};
`;

const StyledDd = styled.dd`
  margin-left: 0.3rem;
  margin-right: 0.3rem;
`;

interface Props {
  tag: MinimalTagType;
  onRemoveItem: (tag: MinimalTagType) => void;
}

class SearchTag extends Component<Props & CustomWithTranslation> {
  constructor(props: Props & CustomWithTranslation) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(e: MouseEvent<HTMLButtonElement>) {
    const { onRemoveItem, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    onRemoveItem(tag);
  }

  render() {
    const { tag, t } = this.props;

    return (
      <StyledDl>
        <StyledDt>{t(`searchForm.tagType.${tag.type}`)}:</StyledDt>
        <StyledDd>{tag.name || ''}</StyledDd>
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </StyledDl>
    );
  }

  static propTypes = {
    tag: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onRemoveItem: PropTypes.func.isRequired,
  };
}

export default withTranslation()(SearchTag);
