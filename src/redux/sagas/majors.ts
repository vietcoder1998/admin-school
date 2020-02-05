import { MAJORS } from '../../services/api/private.api';
import { IMajors } from './../../models/majors';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListMajorsData(action: any) {
    let res = yield call(callMajors, action);
    let data: IMajors = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.MAJORS.GET_MAJORS,
        data
    });
}

function callMajors(action: any) {
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
            GET, MAJORS,
            undefined,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 10,
                name: action.name
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    }
};

export function* MajorsWatcher() {
    yield takeEvery(
        REDUX_SAGA.MAJORS.GET_MAJORS,
        getListMajorsData
    )
}