import { transformConceptFromApiVersion } from '../conceptUtil';
import { apiConcept } from './conceptMocks';

test('transformConceptFromApiVersion', () => {
  const transformed = transformConceptFromApiVersion(apiConcept);
  expect(transformed).toMatchSnapshot();
});
