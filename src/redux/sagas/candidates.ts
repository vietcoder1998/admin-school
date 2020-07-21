// import { POST } from '../../const/method';
// import { CANDIDATES } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
// import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListCandidatesData(action: any) {
    let res = yield call(callCandidates, action);

    let data = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };
    console.log(res)
    if (res.code === 200) {
        data = res.data;
       
    }

    yield put({
        type: REDUX.CANDIDATES.GET_CANDIDATES,
        data
    });
}

function callCandidates(action: any) {
    if (action.body) {
        try {
            // let res = _requestToServer(
            //     POST,
            //     CANDIDATES +'/query',
            //     action.body ? action.body : null,
            //     {
            //         pageIndex: action.pageIndex ? action.pageIndex : 0,
            //         pageSize: action.pageSize ? action.pageSize : 10,
            //         sortBy: "c.createdDate",
            //         sortType: "desc"
            //     },
            //     undefined,
            //     undefined,
            //     false,
            //     false
            // )
            // return res

        } catch (error) {
            throw error;
        }
    }
}

export function* CandidatesWatcher() {
    yield takeEvery(
        REDUX_SAGA.CANDIDATES.GET_CANDIDATES,
        getListCandidatesData
    )
}