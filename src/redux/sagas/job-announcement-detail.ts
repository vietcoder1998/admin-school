import { IJobAnnouncementDetail } from '../models/job-annoucement-detail';
import { GET } from '../../const/method';
import { JOB_ANNOUNCEMENTS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListJobAnnouncementDetailData(action: any) {
    let res = yield call(callJobAnnouncementDetail, action);
    let data: IJobAnnouncementDetail = {
        id: null,
        employerCoverUrl: null,
        jobName: {
            id: null,
            name: null,
            jobGroup: {
                id: null,
                name: null,
                priority: null
            }
        },
        description: null,
        jobTitle: null,
        address: null,
        requiredSkills: [],
        region: {
            id: null,
            name: null
        },
        shifts: [],
        atHeadquarters: null,
        lat: null,
        lon: null,
        employerBranchID: null,
        employerBranchName: null,
        employerID: null,
        employerName: null,
        employerLogoUrl: null,
        createdDate: null,
        expired: null,
        expirationDate: null,
        timeLeft: null,
        jobType: null,
        pendingApplied: null,
        acceptedApplied: null,
        rejectedApplied: null,
        appliedCount: null,
        suitableCount: null,
        disable: null,
        hidden: null,
        enableNotification: null,
        priority: {
            homePriority: null,
            homeExpired: null,
            homeExpiration: null,
            homeTimeLeft: null,

            searchPriority: null,
            searchExpired: null,
            searchExpiration: null,
            searchTimeLeft: null
        }
    };

    if (res.code === 200) {
        data = res.data;
    }

    yield put({
        type: REDUX.JOB_ANNOUNCEMENT_DETAIL.GET_JOB_ANNOUNCEMENT_DETAIL,
        data
    });
}

function callJobAnnouncementDetail(action: any) {
    if (action.id) {
        try {
            let res = _requestToServer(
                GET,
                JOB_ANNOUNCEMENTS + `/${action.id}`,
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                false,
            )

            return res
        } catch (e) {
            throw e;
        }
    }
}

export function* JobAnnouncementDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_ANNOUNCEMENT_DETAIL.GET_JOB_ANNOUNCEMENT_DETAIL,
        getListJobAnnouncementDetailData
    )
}