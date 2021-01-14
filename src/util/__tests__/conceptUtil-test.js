import { transformApiToFormikVersion } from '../conceptUtil';
import { apiConcept } from './conceptMocks';

test('transformConceptFromApiVersion', () => {
  const transformed = transformApiToFormikVersion(apiConcept);
  expect(transformed).toMatchSnapshot();
});
