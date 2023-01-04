/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface Props {
  audio: {
    src: string;
    mimeType: string;
  };
}

const AudioPlayer = ({ audio }: Props) => {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio controls>
      <source src={audio.src} type={audio.mimeType} />
    </audio>
  );
};

export default AudioPlayer;
