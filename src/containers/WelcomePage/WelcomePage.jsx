/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { OneColumn } from 'ndla-ui';
import { Link } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import {
  toCreateTopicArticle,
  toCreateLearningResource,
  toCreateAudioFile,
  toCreateImage,
  toSearch,
} from '../../util/routeHelpers';

const topicArticleQuery = {
  articleTypes: 'topic-article',
  types: ['articles'],
};
const learningResourceQuery = { articleTypes: 'standard', types: ['articles'] };

export const WelcomePage = ({ t }) => (
  <OneColumn cssModifier="clear">
    <article>
      <section>
        <h1>{t('welcomePage.shortcuts')}</h1>
        <ul>
          <li>
            <Link to={`${toSearch(learningResourceQuery)}`}>
              {t('welcomePage.searchLearningResource')}
            </Link>
          </li>
          <li>
            <Link to={`${toSearch(topicArticleQuery)}`}>
              {t('welcomePage.searchTopicArticles')}
            </Link>
          </li>
          <li>
            <Link to={`${toCreateLearningResource()}`}>
              {t('welcomePage.createLearningResource')}
            </Link>
          </li>
          <li>
            <Link to={`${toCreateTopicArticle()}`}>
              {t('welcomePage.createTopicArticle')}
            </Link>
          </li>
          <li>
            <Link to={`${toCreateAudioFile()}`}>
              {t('welcomePage.createAudioFile')}
            </Link>
          </li>
          <li>
            <Link to={`${toCreateImage()}`}>
              {t('welcomePage.createImage')}
            </Link>
          </li>
        </ul>
      </section>
    </article>
  </OneColumn>
);

WelcomePage.propTypes = {};

export default injectT(WelcomePage);
