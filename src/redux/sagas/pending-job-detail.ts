import { IPendingJobDetail } from '../models/pending-job-detail';
import { GET } from '../../common/const/method';
import { PENDING_JOBS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListPendingJobDetailData(action: any) {
    let res = yield call(callPendingJobDetail, action);
    let data: IPendingJobDetail = {
        createdDate: null,
        employer: {
            employerName: null,
            id: null,
            logoUrl: null,
            profileVerified: false
        },
        data: {
            description: null,
            employerBranchID: null,
            expirationDate: null,
            jobNameID: null,
            jobTitle: null,
            jobType: null,
            requiredSkillIDs: [],
            shifts: [],
        },
        id: null,
        jobID: null,
        message: null,
        repliedDate: null,
        state: null,
    };

    if (res) {
        data = res.data;
    };

    yield put({
        type: REDUX.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL,
        data
    });
};

function callPendingJobDetail(action: any) {
    try {
        let id;
        if (action.id) {
            id = action.id;
            return _requestToServer(
                GET, PENDING_JOBS + `/${id}`,
                undefined,
                undefined, undefined, undefined, false, false
            )
        };
    } catch (e) {
        throw e;
    };
};

export function* PendingJobDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL,
        getListPendingJobDetailData
    )
};