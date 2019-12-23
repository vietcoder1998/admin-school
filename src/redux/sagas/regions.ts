import { REGIONS } from '../../services/api/private.api';
import { IRegions } from '../models/regions';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListRegionsData(action: any) {
    let res = yield call(callRegions, action);

    let data: IRegions = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    };

    yield put({
        type: REDUX.REGIONS.GET_REGIONS,
        data
    });
}

function callRegions(action: any) {
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
            GET, REGIONS,
            null,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 0
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    }

}

export function* RegionsWatcher() {
    yield takeEvery(
        REDUX_SAGA.REGIONS.GET_REGIONS,
        getListRegionsData
    )
}