import { IAnnouTypes } from '../models/annou-types';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { ANNOU_TYPES } from '../../services/api/private.api';

function* getListAnnouTypesData(action: any) {
    let res = yield call(callAnnouTypes, action);

    let data: IAnnouTypes = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.ANNOU_TYPES.GET_ANNOU_TYPES,
        data
    });
}

function callAnnouTypes(action: any) {
    try {
        let target;
        if (action.data) {
            target = action.data.target;
        }

        return _requestToServer(
            GET, ANNOU_TYPES,
            null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
                target
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e
    }
}

export function* AnnouTypesWatcher() {
    yield takeEvery(
        REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES,
        getListAnnouTypesData
    )
}