import { take, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as actions from './messagesActions';

export function* watchPublishDraft() {
  while (true) {
    yield take(actions.showSaved);
    yield delay(3000);
    yield put(actions.clearSaved());
  }
}

export default [watchPublishDraft];
