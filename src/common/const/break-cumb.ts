export const routePath = {
    ADMIN: `/admin`,
    LIST: '/list',
    JOBS: '/jobs',
    CREATE: '/create',
    COPY: '/copy',
    FIX: '/fix',
    DETAIL: '/detail',
    DATA: '/data',
    PENDING_JOBS: '/pending-jobs',
    LANGUAGES: '/languages',
    MAJORS: '/majors',
    TYPE_SCHOOLS: '/type-schools',
    REGIONS: '/regions',
    JOB_NAMES: '/job-names',
    SKILLS: '/skills',
    JOB_GROUPS: '/job-groups',
    BRANCHES: '/branches',
    ROLES: '/role',
    ROLES_ADMIN: '/role-admins',
    ADMIN_ACCOUNTS: "/admin-accounts",
    ANNOU_TYPE: "/annou-types",
    JOB_MANAGEMENT: "/job-management",
    USER_CONTROLLER:'/user-controller'
};

export const routeLink = {
    // data mgm
    LANGUAGES: routePath.ADMIN + routePath.DATA + routePath.LANGUAGES,
    MAJORS: routePath.ADMIN + routePath.DATA + routePath.MAJORS,
    TYPE_SCHOOLS: routePath.ADMIN + routePath.DATA + routePath.TYPE_SCHOOLS,
    REGIONS: routePath.ADMIN + routePath.DATA + routePath.REGIONS,
    JOB_NAMES: routePath.ADMIN + routePath.DATA + routePath.JOB_NAMES,
    SKILLS: routePath.ADMIN + routePath.DATA + routePath.SKILLS,
    JOB_GROUPS: routePath.ADMIN + routePath.DATA + routePath.JOB_GROUPS,
    BRANCHES: routePath.ADMIN + routePath.DATA + routePath.BRANCHES,
    ANNOU_TYPE: routePath.ADMIN + routePath.DATA + routePath.PENDING_JOBS,

    // role
    ROLES_ADMIN: routePath.ADMIN + routePath.JOBS + routePath.ROLES,
    ADMIN_ACCOUNTS: routePath.ADMIN + routePath.ROLES + routePath.ADMIN_ACCOUNTS,

    // job management
    PENDING_JOBS: routePath.ADMIN + routePath.JOBS + routePath.PENDING_JOBS,
    JOB_MANAGEMENTS: routePath.ADMIN + routePath.JOBS + routePath.PENDING_JOBS,

    // user management
    USER_CONTROLLER: routePath.ADMIN + routePath.USER_CONTROLLER
};

export const breakCumb = [
    { label: "jobs", name: "Tuyển dụng", icon: null, url: "/jobs", disable: true },
    { label: "create", name: "Tạo mới", icon: null, url: "/create", disable: true },
    { label: "detail", name: "Chi tiết", icon: null, url: "/detail", disable: true },
    { label: "list", name: "Danh sách", icon: null, url: "/list", disable: true },
    { label: "fix", name: "Chỉnh sửa", icon: null, url: "/fix", disable: true },
    { label: "data", name: "Danh mục dữ liêu", icon: "database", url: "/data", disable: true },
    { label: "roles", name: "Quyền", icon: null, url: "/roles", disable: true },

    { label: "job-management", name: "Quản lý bài viết", icon: "file-add", url: "/" },
    { label: "pending-jobs", name: "Xét duyệt bài đăng", icon: "clock-circle", url: routeLink.PENDING_JOBS },
    { label: "languages", name: "Ngôn ngữ", icon: null, url:routeLink.LANGUAGES + routePath.LIST },
    { label: "majors", name: "Loại ngành nghề", icon: null, url: routeLink.MAJORS + routePath.LIST  },
    { label: "type-schools", name: "Loại trường", icon: null, url: routeLink.TYPE_SCHOOLS + routePath.LIST  },
    { label: "regions", name: "Tỉnh thành", icon: null, url: routeLink.REGIONS + routePath.LIST  },
    { label: "job-names", name: "Loại công việc", icon: null, url: routeLink.JOB_NAMES + routePath.LIST },
    { label: "skills", name: "Kỹ năng", icon: null, url: routeLink.SKILLS + routePath.LIST },
    { label: "job-groups", name: "Nhóm công việc", icon: null, url: routeLink.JOB_GROUPS + routePath.LIST },
    { label: "branches", name: "Nhóm ngành", icon: null, url: routeLink.BRANCHES + routePath.LIST },
    { label: "role-admins", name: "Quản trị viên", icon: null, url: routeLink.ROLES_ADMIN + routePath.LIST },
    { label: "admin-accounts", name: "Tài khoản admin", icon: null, url: routeLink.ADMIN_ACCOUNTS + routePath.LIST },
    { label: "annou-types", name: "Tài khoản admin", icon: null, url: routeLink.ANNOU_TYPE + routePath.LIST },
    { label: "user-controller", name: "Quản lí tài khoản", icon: null, url: routeLink.USER_CONTROLLER + routePath.LIST },
]

export interface IBrk {
    label?: string;
    name?: string;
    icon?: string;
    url?: string;
    disable?: boolean;
}