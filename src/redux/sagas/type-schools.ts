import { TYPE_SCHOOLS } from '../../services/api/private.api';
import { ITypeSchools } from './../../models/type-schools';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListTypeSchoolsData(action: any) {
    let res = yield call(callTypeSchools, action);
    let data: ITypeSchools = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.TYPE_SCHOOLS.GET_TYPE_SCHOOLS,
        data
    });
}

function callTypeSchools(action: any) {
    try {
        let pageIndex;
        let pageSize;
        if (action.pageIndex) {
            pageIndex = action.pageIndex;
        }

        if (action.pageSize) {
            pageSize = action.pageSize;
        }

        return _requestToServer(
            GET, TYPE_SCHOOLS,
            null,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize:
                    pageSize ? pageSize : 10
            },
            undefined, undefined, false, false
        );
    } catch (e) {
        throw e
    };

};

export function* TypeSchoolsWatcher() {
    yield takeEvery(
        REDUX_SAGA.TYPE_SCHOOLS.GET_TYPE_SCHOOLS,
        getListTypeSchoolsData
    )
}