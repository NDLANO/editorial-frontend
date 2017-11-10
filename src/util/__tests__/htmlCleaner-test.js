import { domOperations } from '../htmlCleaner';


const doubleNestedSections = '<section>Seksjon 1</section><section><p>test paragraf</p><section>Seksjon 2 nested</section></section>'

const trippleNestedSections = '<section>Seksjon 1</section><section><p>test paragraf</p><section><section>Seksjon 2 nested</section></section></section>'

// const fourNestedSections = '<section>Seksjon 1</section><section><p>test paragraf</p><section><section><section>Seksjon 2 nested</section></section></section></section>'

const unNestedSection = '<section>Seksjon 1</section><section><p>test paragraf</p>Seksjon 2 nested</section>'

test('util/domOperations doubleNestedSections', () => {
  expect(typeof domOperations).toBe('function');
  expect(domOperations(doubleNestedSections)).toMatch(unNestedSection)
});


test('util/domOperations trippleNestedSections', () => {
  expect(typeof domOperations).toBe('function');
  expect(domOperations(trippleNestedSections)).toMatch(unNestedSection)
});
