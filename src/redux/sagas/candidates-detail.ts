import { ICandidateDetail } from './../../models/candidates-detail';
import { GET } from '../../const/method';
import { CANDIDATES } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListCandidateDetailData(action: any) {
    let res = yield call(callCandidateDetail, action);
    let data: ICandidateDetail = {
        id: null,
        firstName: null,
        lastName: null,
        birthday: null,
        avatarUrl: null,
        email: null,
        phone: null,
        gender: null,
        region: null,
        address: null,
        coverUrl: null,
        description: null,
        lat: null,
        identityCard: null,
        lon: null,
        profileVerified: false,
        lookingForJob: false,
        completePercent: null,
        unlocked: false,
        identityCardFrontImageUrl: null,
        saved: false,
        identityCardBackImageUrl: null,
        rating: {
            attitudeRating: null,
            skillRating: null,
            jobAccomplishmentRating: null,
            ratingCount: null
        },
        applyState: null,
        offerState: null,
        skills: [],
        languageSkills: [],
        experiences: [],
        educations: [],
        desiredJobDto: {
            jobNames: [],
            region: null,
            address: null,
            distance: null,
            lat: null,
            lon: null,
            enableNotification: false,
            mode: null,
            selectedJobGroupID: null,
            jobType: null,
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: false,
            sun: false,
            morning: false,
            afternoon: false,
            evening: false
        }
    };

    if (res.code === 200) {
        data = res.data;
    }

    yield put({
        type: REDUX.CANDIDATES.GET_CANDIDATE_DETAIL,
        data
    });
}

function callCandidateDetail(action: any) {
    if (action.id) {
        try {
            let res = _requestToServer(
                GET,
                CANDIDATES + `/${action.id}/profile`,
                action.body ? action.body : null,
                undefined,
                undefined,
                undefined,
                false,
                false,
            )
            return res;
        } catch (error) {
            throw error
        }
    }
}

export function* CandidateDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.CANDIDATES.GET_CANDIDATE_DETAIL,
        getListCandidateDetailData
    )
}