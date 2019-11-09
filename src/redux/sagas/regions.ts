import { REGIONS } from '../../services/api/private.api';
import { IRegions } from '../models/regions';
import { authHeaders } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListRegionsData(action) {
    let res = yield call(callRegions, action);

    if (res.code === 200) {
        let data: IRegions = res.data;
        yield put({
            type: REDUX.REGIONS.GET_REGIONS,
            data
        });
    }
}

function callRegions(action) {
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
        REGIONS,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        }
    )
}

export function* RegionsWatcher() {
    yield takeEvery(
        REDUX_SAGA.REGIONS.GET_REGIONS,
        getListRegionsData
    )
}