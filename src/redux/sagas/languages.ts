import { LANGUAGES } from '../../services/api/private.api';
import { ILanguages } from './../../models/languages';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListLanguagesData(action: any) {
    let res = yield call(callLanguages, action);
    let data: ILanguages = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0
    };

    if (res.code === 200) {
        data = res.data
        console.log(data)
    }

    yield put({
        type: REDUX.LANGUAGES.GET_LANGUAGES,
        data
    });
};

function callLanguages(action: any) {
    try {
        return _requestToServer(
            GET, LANGUAGES,
            null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
                name: action.name
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    };
};

export function* LanguagesWatcher() {
    yield takeEvery(
        REDUX_SAGA.LANGUAGES.GET_LANGUAGES,
        getListLanguagesData
    )
};