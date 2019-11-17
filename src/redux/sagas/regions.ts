import {REGIONS} from '../../services/api/private.api';
import {IRegions} from '../models/regions';
import {GET} from '../../common/const/method';
import {takeEvery, put, call,} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'

function* getListRegionsData(action: any) {
    let res = yield call(callRegions, action);

    if (res.code === 200) {
        let data: IRegions = res.data;
        yield put({
            type: REDUX.REGIONS.GET_REGIONS,
            data
        });
    }
}

function callRegions(action: any) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET, REGIONS,
        null,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        },
        undefined, undefined, false, false
    )
}

export function* RegionsWatcher() {
    yield takeEvery(
        REDUX_SAGA.REGIONS.GET_REGIONS,
        getListRegionsData
    )
}