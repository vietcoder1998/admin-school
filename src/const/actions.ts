export const REDUX = {
    AUTHEN: {
        FAIL_AUTHEN: "FAIL_AUTHEN",
        EXACT_AUTHEN: "EXACT_AUTHEN",
    },
    HANDLE_MODAL: "HANDLE_MODAL",
    HANDLE_DRAWER: "HANDLE_DRAWER",
    HANDLE_LOADING: "HANDLE_LOADING",
    PENDING_JOBS: {
        GET_PENDING_JOBS: "GET_PENDING_JOBS",
    },
    PENDING_JOB_DETAIL: {
        GET_PENDING_JOB_DETAIL: "GET_PENDING_JOB_DETAIL",
    },
    JOB_NAMES: {
        GET_JOB_NAMES: "GET_JOB_NAMES",
        GET_SINGLE_JOB_NAME: "GET_SINGLE_JOB_NAME"
    },
    ANNOU_TYPES: {
        GET_ANNOU_TYPES: "GET_ANNOU_TYPES",
    },
    APPLY_CAN: {
        GET_APPLY_CAN: "GET_APPLY_CAN"
    },
    ANNOUNCEMENTS: {
        GET_ANNOUNCEMENTS: "GET_ANNOUNCEMENTS"
    },

    ANNOUNCEMENT_DETAIL: {
        GET_ANNOUNCEMENT_DETAIL: "GET_ANNOUNCEMENT_DETAIL"
    },
    TYPE_SCHOOLS: {
        GET_TYPE_SCHOOLS: "GET_TYPE_SCHOOLS",
    },
    LANGUAGES: {
        GET_LANGUAGES: "GET_LANGUAGES"
    },
    REGIONS: {
        GET_REGIONS: "GET_REGIONS"
    },

    SKILLS: {
        GET_SKILLS: "GET_SKILLS"
    },
    MAJORS: {
        GET_MAJORS: "GET_MAJORS"
    },

    JOB_GROUPS: {
        GET_JOB_GROUPS: "GET_JOB_GROUPS"
    },

    BRANCHES: {
        GET_BRANCHES: "GET_BRANCHES"
    },
    ROLES: {
        GET_ROLES: "GET_ROLES",
        GET_ROLE_DETAIL: "GET_ROLE_DETAIL"
    },
    API_CONTROLLER: {
        GET_API_CONTROLLER: "GET_API_CONTROLLER"
    },
    API_CONTROLLER_ROLES: {
        GET_API_CONTROLLER_ROLES: "GET_API_CONTROLLER_ROLES"
    },
    JOB_SERVICE: {
        GET_JOB_SERVICE: "GET_JOB_SERVICE"
    },
    ADMIN_ACCOUNTS: {
        GET_ADMIN_ACCOUNTS: "GET_ADMIN_ACCOUNTS",
        GET_ADMIN_ACCOUNT_DETAIL: "GET_ADMIN_ACCOUNT_DETAIL"
    },

    MAJOR_JOB_NAMES: {
        GET_MAJOR_JOB_NAMES: "GET_MAJOR_JOB_NAMES",
    },

    ANNOU_COMMENTS: {
        GET_ANNOU_COMMENTS: "GET_ANNOU_COMMENTS",
    },
    APPLY_JOB: {
        GET_APPLY_JOB: "GET_APPLY_JOB"
    },
    EM_BRANCHES: {
        GET_EM_BRANCHES: "GET_EM_BRANCHES"
    },
    EMPLOYER: {
        GET_EMPLOYER: "GET_EMPLOYER"
    },
    USER_CONTROLLER: {
        GET_USER_CONTROLLER: "GET_USER_CONTROLLER"
    },

    EM_CONTROLLER: {
        GET_EM_CONTROLLER: "GET_EM_CONTROLLER",
        GET_EM_CONTROLLER_DETAIL: "GET_EM_CONTROLLER_DETAIL",
    },
    EM_BRANCH: {
        GET_EM_BRANCH: "GET_EM_BRANCH",
    },
    SCHOOLS: {
        GET_SCHOOLS: "GET_SCHOOLS",
        GET_SCHOOL_DETAIL: "GET_SCHOOL_DETAIL"
    },
    STUDENTS: {
        GET_STUDENTS: "GET_STUDENTS",
        GET_STUDENT_DETAIl: "GET_STUDENT_DETAIl"
    },
    JOB_ANNOUNCEMENT_DETAIL: {
        GET_JOB_ANNOUNCEMENT_DETAIL: "GET_JOB_ANNOUNCEMENT_DETAIL"
    },
    JOB_SUITABLE_CANDIDATE: {
        GET_JOB_SUITABLE_CANDIDATE: "JOB_SUITABLE_CANDIDATE"
    },
    JOB_ANNOUNCEMENTS: {
        GET_JOB_ANNOUNCEMENTS: "GET_JOB_ANNOUNCEMENTS"
    },
    CANDIDATES: {
        GET_CANDIDATES: "GET_CANDIDATES",
        GET_CANDIDATE_DETAIL: "GET_CANDIDATE_DETAIL",
    },
    IMPORT:  {
        POST_IMPORT_CAN: "POST_IMPORT_CAN",
        POST_IMPORT_EM: "POST_IMPORT_EM",
    }
};

export const REDUX_SAGA = {
    PENDING_JOBS: {
        GET_PENDING_JOBS: "GET_PENDING_JOBS_DATA",
    },
    PENDING_JOB_DETAIL: {
        GET_PENDING_JOB_DETAIL: "GET_PENDING_JOB_DETAIL_DATA",
    },
    JOB_NAMES: {
        GET_JOB_NAMES: "GET_JOB_NAMES_DATA",
    },
    JOB_SUITABLE_CANDIDATE: {
        GET_JOB_SUITABLE_CANDIDATE: "GET_JOB_SUITABLE_CANDIDATE_DATA",
    },
    MAJOR_JOB_NAMES: {
        GET_MAJOR_JOB_NAMES: "GET_MAJOR_JOB_NAMES_DATA",
    },
    ANNOU_TYPES: {
        GET_ANNOU_TYPES: "GET_ANNOU_TYPES_DATA",
    },
    ANNOU_COMMENTS: {
        GET_ANNOU_COMMENTS: "GET_ANNOU_COMMENTS_DATA",
    },
    APPLY_CAN: {
        GET_APPLY_CAN: "GET_APPLY_CAN_DATA"
    },
    ANNOUNCEMENTS: {
        GET_ANNOUNCEMENTS: "GET_ANNOUNCEMENTS_DATA"
    },
    ANNOUNCEMENT_DETAIL: {
        GET_ANNOUNCEMENT_DETAIL: "GET_ANNOUNCEMENT_DETAIL_DATA"
    },
    TYPE_SCHOOLS: {
        GET_TYPE_SCHOOLS: "GET_TYPE_SCHOOLS_DATA",
    },
    LANGUAGES: {
        GET_LANGUAGES: "GET_LANGUAGES_DATA"
    },
    REGIONS: {
        GET_REGIONS: "GET_REGIONS_DATA"
    },
    SKILLS: {
        GET_SKILLS: "GET_SKILLS_DATA"
    },
    MAJORS: {
        GET_MAJORS: "GET_MAJORS_DATA"
    },
    JOB_GROUPS: {
        GET_JOB_GROUPS: "GET_JOB_GROUPS_DATA"
    },
    JOB_SERVICE: {
        GET_JOB_SERVICE: "GET_JOB_SERVICE_DATA"
    },
    BRANCHES: {
        GET_BRANCHES: "GET_BRANCHES_DATA"
    },
    ROLES: {
        GET_ROLES: "GET_ADMINS_DATA",
        GET_ROLE_DETAIL: "GET_ROLE_DETAIL_DATA"
    },

    API_CONTROLLER: {
        GET_API_CONTROLLER: "GET_API_CONTROLLER_DATA"
    },
    API_CONTROLLER_ROLES: {
        GET_API_CONTROLLER_ROLES: "GET_API_CONTROLLER_ROLES_DATA"
    },
    ADMIN_ACCOUNTS: {
        GET_ADMIN_ACCOUNTS: "GET_ADMIN_ACCOUNTS_DATA",
        GET_ADMIN_ACCOUNT_DETAIL: "GET_ADMIN_ACCOUNT_DETAIL_DATA",
    },
    APPLY_JOB: {
        GET_APPLY_JOB: "GET_APPLY_JOB_DATA"
    },
    EM_BRANCHES: {
        GET_EM_BRANCHES: "GET_EM_BRANCHES_DATA"
    },
    EMPLOYER: {
        GET_EMPLOYER: "GET_EMPLOYER_DATA"
    },
    USER_CONTROLLER: {
        GET_USER_CONTROLLER: "GET_USER_CONTROLLER_DATA"
    },
    EM_CONTROLLER: {
        GET_EM_CONTROLLER: "GET_EM_CONTROLLER_DATA",
        GET_EM_CONTROLLER_DETAIL: "GET_EM_CONTROLLER_DETAIL_DATA"
    },
    EM_BRANCH: {
        GET_EM_BRANCH_DETAIL: "GET_EM_BRANCH_DETAIL",
        GET_EM_BRANCH: "GET_EM_BRANCH_DATA",
    },
    SCHOOLS: {
        GET_SCHOOLS: "GET_SCHOOLS_DATA",
        GET_SCHOOL_DETAIL: "GET_SCHOOL_DETAIl_DATA"
    },
    STUDENTS: {
        GET_STUDENTS: "GET_STUDENTS_DATA",
        GET_STUDENT_DETAIl: "GET_STUDENT_DETAIl_DAT"
    },
    JOB_ANNOUNCEMENT_DETAIL: {
        GET_JOB_ANNOUNCEMENT_DETAIL: "GET_JOB_ANNOUNCEMENT_DETAIL_DATA"
    },
    JOB_ANNOUNCEMENTS: {
        GET_JOB_ANNOUNCEMENTS: "GET_JOB_ANNOUNCEMENTS_DATA"
    },
    CANDIDATES: {
        GET_CANDIDATES: "GET_CANDIDATES_DATA",
        GET_CANDIDATE_DETAIL: "GET_CANDIDATE_DETAIL_DATA",
    },
    IMPORT:  {
        POST_IMPORT_CAN: "POST_IMPORT_CAN_DATA",
        POST_IMPORT_EM: "POST_IMPORT_EM_DATA",
    }
};