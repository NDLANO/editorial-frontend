import { Copyright } from '../../interfaces';

interface NewPodcastMeta {
  header: string;
  introduction: string;
  coverPhotoId: string;
  coverPhotoAltText: string;
  manuscript: string;
}

interface PodcastMeta {
  header: string;
  introduction: string;
  coverPhoto: {
    id: string;
    url: string;
    altText: string;
  };
  manuscript: string;
  language: string;
}

export interface NewAudioMetaInformation {
  id?: number; // Only used by frontend, ignored by backend
  title: string;
  language: string;
  copyright: Copyright;
  tags: string[];
  audioType?: string;
  podcastMeta?: NewPodcastMeta;
}

export interface UpdatedAudioMetaInformation extends NewAudioMetaInformation {
  id: number;
  revision: number;
}

export interface AudioApiType {
  id: number;
  revision: number;
  title: {
    title: string;
    language: string;
  };
  audioFile: {
    url: string;
    mimeType: string;
    fileSize: number;
    language: string;
  };
  copyright: Copyright;
  tags: {
    tags: string[];
    language: string;
  };
  supportedLanguages: string[];
  audioType: string;
  podcastMeta?: PodcastMeta;
}

export interface FlattenedAudioApiType extends Omit<AudioApiType, 'title' | 'tags'> {
  title: string;
  tags: string[];
  language?: string;
}

export interface SearchParams {
  'audio-type'?: string;
  'page-size'?: number;
  language?: string;
  page?: number;
  query?: string;
  sort?: string;
}
