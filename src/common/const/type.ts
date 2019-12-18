export const TYPE = {
    ALL: "ALL",

    SUCCESS: 'success',
    ERROR: "error",
    WARNING: "warning",

    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    PENDING: "PENDING",

    PARTTIME: "PARTTIME",
    FULLTIME: "FULLTIME",
    INTERNSHIP: "INTERNSHIP",

    CANDIDATE: "CANDIDATE",
    EMPLOYER: "EMPLOYER",
    SCHOOL: "SCHOOL",
    PUBLIC: "PUBLIC",
    STUDENT: "STUDENT",

    CREATE: "CREATE",
    EDIT: "EDIT",
    DELETE: "DELETE",
    DELETE_SELECTED: "DELETE_SELECTED",
    BAN: "BAN",

    INPUT: "INPUT",
    SELECT: "SELECT",

    NORMAL_LOGIN: "NORMAL_LOGIN",
    REFESH_LOGIN: "REFESH_LOGIN",

    COPY: "COPY",
    FIX: "FIX",
    MALE: "MALE",
    FEMALE: "FEMALE",
    BOTH: "BOTH",

    TRUE: "TRUE",
    FALSE: "FALSE",

    USER_CONTROLLER: {
        username: 'username',
        email: 'email',
        activated: 'activated',
        createdDate: 'createdDate',
        lastActive: 'lastActive',
        banned: 'banned',
    },

    EM_CONTROLLER: {
        employerName: 'employerName',
        taxCode: 'taxCode',
        regionID: 'regionID',
        profileVerified: 'profileVerified',
        ids: "ids"
    },

    EM_BRANCHES: {
        headquarters: 'headquarters',
        regionID: 'regionID'
    },

    SCHOOLS: {
        name: 'name',
        shortName: 'shortName',
        educatedScale: 'educatedScale',
        regionID: 'regionID',
        schoolTypeID: 'schoolTypeID',
        email: 'email',
        employerID: 'employerID',
        connected: 'connected',
        createdDate: 'createdDate'
    }
};
