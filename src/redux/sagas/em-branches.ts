import { IEmBranchesFilter } from './../../models/em-branches';
import { IEmBranches } from './../../models/em-branches';
import { POST } from '../../const/method';
import { EM_BRANCHES_API } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListEmBranchesData(action: any) {
    let res = yield call(callEmBranches, action);
    let data: IEmBranches = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    };

    yield put({
        type: REDUX.EM_BRANCHES.GET_EM_BRANCHES,
        data
    });
};

function callEmBranches(action: any) {
    try {
        let body: IEmBranchesFilter = {
            headquarters: null,
            regionID: null
        };


        if (action.body) {
            body = action.body
        };

        if (action.id) {
            return _requestToServer(
                POST,
                EM_BRANCHES_API + `/${action.id}/employerBranchs/query`,
                body,
                {
                    pageIndex: action.pageIndex ? action.pageIndex : 0,
                    pageSize: action.pageSize ? action.pageSize : 0
                },
                undefined,
                undefined,
                false,
                false
            );
        }
    } catch (e) {
        throw e;
    }
};

export function* EmBranchesWatcher() {
    yield takeEvery(
        REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES,
        getListEmBranchesData
    );
};