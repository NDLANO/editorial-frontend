/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Done } from '@ndla/icons/editor';

import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { updateStatusDraft } from '../../../../modules/draft/draftApi';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';

const PublishTopic = ({ t, contentUri }) => {
  const articleId = contentUri.split(':').pop();
  const publishTopic = () => {
    updateStatusDraft(articleId, PUBLISHED)
  }
  return (
    <MenuItemButton stripped onClick={publishTopic} >
      <RoundIcon small icon={<Done />} />
      {'Publiser emne'}
    </MenuItemButton>
  )
}

PublishTopic.propTypes = {
  contentUri: PropTypes.string.isRequired,
}

export default injectT(PublishTopic);