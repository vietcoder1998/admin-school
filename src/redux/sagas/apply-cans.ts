import { APPLY_CAN } from './../../services/api/private.api';
import { IApplyCans } from '../../models/apply-cans';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListApplyCansData(action: any) {
    let res = yield call(callApplyCans, action);
    let data: IApplyCans = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.APPLY_CAN.GET_APPLY_CAN,
        data
    });
}

function callApplyCans(action: any) {
    try {
        return _requestToServer(
            GET, APPLY_CAN + `/${action.id}/apply/students`,
            {
                jobID: action.id ? action.id : null
            },
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
            },
            undefined, undefined, undefined, false
        )
    } catch (e) {
        throw e
    }

}

export function* ApplyCansWatcher() {
    yield takeEvery(
        REDUX_SAGA.APPLY_CAN.GET_APPLY_CAN,
        getListApplyCansData
    )
}