import { DraftApiLicense } from './draftApiInterfaces';
import { ImageApiLicense } from '../image/imageApiInterfaces';

export const draftLicensesToImageLicenses = (licenses: DraftApiLicense[]): ImageApiLicense[] =>
  licenses.map(l => ({ license: l.license, description: l.description || '', url: l.url }));
