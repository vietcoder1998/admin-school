import { POST } from './../../const/method';
import { IEmployers } from './../../models/employers';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { EMPLOYER } from '../../services/api/private.api';

function* getListEmployersData(action: any) {
    let res = yield call(callEmployers, action);

    let data: IEmployers = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0
    };

    if (res.code === 200) {
        data = res.data
    };

    yield put({
        type: REDUX.EMPLOYER.GET_EMPLOYER,
        data
    });
};

function callEmployers(action: any) {
    try {
        let target;
        let body;

        if (action.body) {
            body = action.body
        };

        return _requestToServer(
            POST, EMPLOYER,
            body,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
                target
            },
            undefined, undefined, false, false
        );
    } catch (e) {
        throw e;
    }
};

export function* EmployersWatcher() {
    yield takeEvery(
        REDUX_SAGA.EMPLOYER.GET_EMPLOYER,
        getListEmployersData
    );
};