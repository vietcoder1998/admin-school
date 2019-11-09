import { TYPE_SCHOOLS } from './../../services/api/private.api';
import { ITypeSchools } from './../models/type-schools';
import { authHeaders } from './../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListTypeSchoolsData(action) {
    let res = yield call(callTypeSchools, action);

    if (res.code === 200) {
        let data: ITypeSchools = res.data;
        yield put({
            type: REDUX.TYPE_SCHOOLS.GET_TYPE_SCHOOLS,
            data
        });
    }
}

function callTypeSchools(action) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET,
        null,
        TYPE_SCHOOLS,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        }
    )
}

export function* TypeSchoolsWatcher() {
    yield takeEvery(
        REDUX_SAGA.TYPE_SCHOOLS.GET_TYPE_SCHOOLS,
        getListTypeSchoolsData
    )
}