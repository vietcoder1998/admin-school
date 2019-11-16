import {LANGUAGES} from '../../services/api/private.api';
import {ILanguages} from '../models/languages';
import {GET} from '../../common/const/method';
import {takeEvery, put, call,} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'

function* getListLanguagesData(action: any) {
    let res = yield call(callLanguages, action);
    if (res.code === 200) {
        let data: ILanguages = res.data;
        yield put({
            type: REDUX.LANGUAGES.GET_LANGUAGES,
            data
        });
    }
}

function callLanguages(action: any) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET, LANGUAGES,
        null,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        }
    )
}

export function* LanguagesWatcher() {
    yield takeEvery(
        REDUX_SAGA.LANGUAGES.GET_LANGUAGES,
        getListLanguagesData
    )
}