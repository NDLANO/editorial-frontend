/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import CreateAudio from './CreateAudio';
import EditAudio from './EditAudio';
import { useAudio } from '../../modules/audio/audioQueries';
import ResourcePage from '../../components/ResourcePage';

const AudioUploaderPage = () => (
  <ResourcePage
    CreateComponent={CreateAudio}
    EditComponent={EditAudio}
    useHook={useAudio}
    createUrl="/media/audio-upload/new"
    titleTranslationKey="htmlTitles.audioUploaderPage"
  />
);

export default AudioUploaderPage;
