/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Audio } from 'ndla-ui/icons';
import { toEditAudio } from '../../../util/routeHelpers';
import { AudioResultShape } from '../../../shapes';
import { searchClasses } from '../SearchPage';

const SearchAudio = ({ audio }) => (
  <div {...searchClasses('result')}>
    <div {...searchClasses('content')}>
      <Link to={toEditAudio(audio.id)}>
        <h1 {...searchClasses('title')}>{audio.title}</h1>
      </Link>
    </div>
    <div {...searchClasses('image')}>
      <Audio />
    </div>
  </div>
);

SearchAudio.propTypes = {
  audio: AudioResultShape.isRequired,
};

export default SearchAudio;
