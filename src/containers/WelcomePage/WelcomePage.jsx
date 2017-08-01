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
  toSearch,
} from '../../util/routeHelpers';

const query = { articleTypes: 'topic-article' };

export const WelcomePage = ({ t }) =>
  <div className="c-resources u-padding-top-large">
    <OneColumn cssModifier="narrow">
      <article>
        <section>
          <h1>
            {t('welcomePage.shortcuts')}
          </h1>
          <ul>
            <li>
              <Link to={`${toSearch(query)}`}>
                {t('welcomePage.searchTopicArticles')}
              </Link>
            </li>
            <li>
              <Link to={`${toCreateTopicArticle()}`}>
                {t('welcomePage.createTopicArticle')}
              </Link>
            </li>
            <li>
              <Link to={`${toCreateLearningResource()}`}>
                {t('welcomePage.createLearningResource')}
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </OneColumn>
  </div>;

WelcomePage.propTypes = {};

export default injectT(WelcomePage);
