import { transformApiToCleanConcept } from '../../modules/concept/conceptApiUtil';
import { apiConcept } from './conceptMocks';

test('transformConceptFromApiVersion', () => {
  const transformed = transformApiToCleanConcept(apiConcept, 'nb');
  expect(transformed).toMatchSnapshot();
});
