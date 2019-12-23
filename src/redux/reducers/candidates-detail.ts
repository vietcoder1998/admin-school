import { ICandidateDetail } from '../../redux/models/candidates-detail';
import { REDUX } from '../../const/actions';

let initState: ICandidateDetail = {
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
    skills:[],
    languageSkills:[],
    experiences: [],
    educations:[],
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
        jobType:null,
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

export const CandidateDetail = (state: ICandidateDetail = initState, action: any): ICandidateDetail => {
    switch (action.type) {
        case REDUX.CANDIDATES.GET_CANDIDATE_DETAIL:
            return {
                ...action.data
            };

        default:
            return state;
    };
};