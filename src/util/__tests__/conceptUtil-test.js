import { transformApiToFormikVersion } from '../conceptUtil';
import { apiConcept } from './conceptMocks';

test('transformApiToFormikVersion', () => {
  const transformed = transformApiToFormikVersion(apiConcept);
  expect(transformed).toMatchSnapshot();
});
