export const TYPE = {
    ALL: "ALL",

    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",

    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    PENDING: "PENDING",
    TITLE_HIGHLIGHT: 'TITLE_HIGHLIGHT',


    PARTTIME: "PARTTIME",
    FULLTIME: "FULLTIME",
    INTERNSHIP: "INTERNSHIP",

    CANDIDATE: "CANDIDATE",
    EMPLOYER: "EMPLOYER",
    SCHOOL: "SCHOOL",
    PUBLIC: "PUBLIC",
    STUDENT: "STUDENT",

    HIGHLIGHT: "HIGHLIGHT",
    IN_DAY: "IN_DAY",
    TOP: "TOP",

    CREATE: "CREATE",
    EDIT: "EDIT",
    DELETE: "DELETE",
    DELETE_SELECTED: "DELETE_SELECTED",
    BAN: "BAN",
    CERTIFICATE: "CERTIFICATE",

    INPUT: "INPUT",
    SELECT: "SELECT",
    TEXT_AREA: "TEXT_AREA",

    NORMAL_LOGIN: "NORMAL_LOGIN",
    REFESH_LOGIN: "REFESH_LOGIN",

    COPY: "COPY",
    FIX: "FIX",
    MALE: "MALE",
    FEMALE: "FEMALE",
    BOTH: "BOTH",
    SEARCH: "SEARCH",
    DETAIL: "DETAIL",

    TRUE: "TRUE",
    FALSE: "FALSE",

    USER_CONTROLLER: {
        username: "username",
        email: "email",
        activated: "activated",
        createdDate: "createdDate",
        lastActive: "lastActive",
        banned: "banned",
    },

    EM_CONTROLLER: {
        employerName: "employerName",
        taxCode: "taxCode",
        regionID: "regionID",
        profileVerified: "profileVerified",
        ids: "ids",
        username: "username"
    },

    EM_BRANCHES: {
        headquarters: "headquarters",
        regionID: "regionID",
        username: "username"
    },

    SCHOOLS: {
        name: "name",
        shortName: "shortName",
        educatedScale: "educatedScale",
        regionID: "regionID",
        schoolTypeID: "schoolTypeID",
        email: "email",
        employerID: "employerID",
        connected: "connected",
        createdDate: "createdDate",
        username: "username"
    },

    JOB_FILTER: {
        expired: "expired",
        hidden: "hidden",
        jobType: "jobType",
        employerID: "employerID",
        homePriority: "homePriority",
        homeExpired: "homeExpired",
        searchPriority: "searchPriority",
        searchExpired: "searchExpired",
        excludedJobIDs: "excludedJobIDs",
        jobNameIDs: "jobNameIDs",
        jobGroupIDs: "jobGroupIDs",
        hasPendingApplied: "hasPendingApplied",
        hasAcceptedApplied: "hasAcceptedApplied",
        hasRejectedApplied: "hasRejectedApplied",
        jobShiftFilter: "jobShiftFilter",
        jobLocationFilter: "jobLocationFilter",
        highlight: "highlight"
    },

    STUDENT_FILTER: {
        gender: "gender",
        birthYearStart: "birthYearStart",
        birthYearEnd: "birthYearEnd",
        regionID: "regionID",
        lookingForJob: "lookingForJob",
        profileVerified: "profileVerified",
        completeProfile: "completeProfile",
        jobNameIDs: "jobNameIDs",
        skillIDs: "skillIDs",
        languageIDs: "languageIDs",
        unlocked: "unlocked",
        ids: "ids",
        username: "username"
    },

    CANDIDATES_FILTER: {
        gender: "gender",
        birthYearStart: "birthYearStart",
        birthYearEnd: "birthYearEnd",
        regionID: "regionID",
        lookingForJob: "lookingForJob",
        profileVerified: "profileVerified",
        completeProfile: "completeProfile",
        jobNameIDs: "jobNameIDs",
        skillIDs: "skillIDs",
        languageIDs: "languageIDs",
        unlocked: "unlocked",
        ids: "ids",
        username: "username"
    },

    PARTNER_FILTER: {
        gender: "gender",
        createdDate: "createdDate",
        regionID: "regionID",
        email: "email",
        unlocked: "unlocked",
        ids: "ids",
        username: "username"
    }
};
