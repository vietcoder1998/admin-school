import { EMPLOYER } from '../services/api/private.api';
export const routePath = {
    ADMIN: `/admin`,
    LIST: '/list',
    JOBS: '/jobs',
    CREATE: '/create',
    COPY: '/copy',
    FIX: '/fix',
    DETAIL: '/detail',
    DATA: '/data',
    USER: '/user',
    APPLY: '/apply',

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
    USER_CONTROLLER:'/user-controller',
    EM_CONTROLLER:'/em-controller',
    EM_BRANCHES: '/em-branches',
    SCHOOLS: '/schools',
    STUDENTS: '/students',
    JOB_ANNOUNCEMENTS: '/job-announcements',
    ANNOUNCEMENT: '/announcements',
    CANDIDATES: '/candidates',
    PARTNER: '/partner',
    EVENT: '/event',
    IN_EVENT: '/in-event',
    EMPLOYER: '/employers'
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
    ANNOU_TYPE: routePath.ADMIN + routePath.DATA + routePath.ANNOU_TYPE,

    // role
    ROLES_ADMIN: routePath.ADMIN + routePath.ROLES + routePath.ROLES_ADMIN,
    ADMIN_ACCOUNTS: routePath.ADMIN + routePath.ROLES + routePath.ADMIN_ACCOUNTS,

    // job management
    PENDING_JOBS: routePath.ADMIN + routePath.PENDING_JOBS,
    ANNOUCEMENT: routePath.ADMIN + routePath.ANNOUNCEMENT ,

    EVENT: routePath.ADMIN + routePath.EVENT,

    // user management
    USER_CONTROLLER: routePath.ADMIN + routePath.USER + routePath.USER_CONTROLLER,
    EM_CONTROLLER: routePath.ADMIN + routePath.USER + routePath.EM_CONTROLLER,
    EM_BRANCHES: routePath.ADMIN + routePath.USER + routePath.EM_BRANCHES,
    SCHOOLS: routePath.ADMIN + routePath.USER + routePath.SCHOOLS,
    STUDENTS: routePath.ADMIN + routePath.USER + routePath.STUDENTS,
    CANDIDATES: routePath.ADMIN + routePath.USER + routePath.CANDIDATES,
    PARTNER: routePath.ADMIN + routePath.USER + routePath.PARTNER,
    // Job Annoucement
    JOB_ANNOUNCEMENTS: routePath.ADMIN + routePath.PENDING_JOBS + routePath.JOB_ANNOUNCEMENTS,
};

export const breakCumb = [
    { label: "jobs", name: "Tuyển dụng", icon: null, url: "/jobs", disable: true },
    { label: "create", name: "Tạo mới", icon: null, url: "/create", disable: true },
    { label: "detail", name: "Chi tiết", icon: null, url: "/detail", disable: true },
    { label: "list", name: "Danh sách", icon: null, url: "/list", disable: true },
    { label: "fix", name: "Chỉnh sửa", icon: null, url: "/fix", disable: true },
    { label: "data", name: "Danh mục dữ liêu", icon: "database", url: "/data", disable: true },
    { label: "role", name: "Quản trị", icon: null, url: "/roles", disable: true },
    { label: "user", name: "Quản lý tài khoản", icon: null, url: "/user", disable: true },
    { label: "pending-jobs", name: "Bài đăng đang chờ", icon: null, url: "/pending-jobs", disable: true },
    { label: "announcements", name: "Bài viết", icon: null, url: "/announcements", disable: true },
    // annoucement
    { label: "annoucement", name: "Quản lý bài viết", icon: null, url: routeLink.ANNOUCEMENT + routePath.LIST },
    // pendingjob
    { label: "pending-jobs", name: "Xét duyệt ", icon: null, url: routeLink.PENDING_JOBS + routePath.LIST },
    // Data
    { label: "languages", name: "Ngôn ngữ", icon: null, url:routeLink.LANGUAGES + routePath.LIST },
    { label: "majors", name: "Loại ngành nghề", icon: null, url: routeLink.MAJORS + routePath.LIST  },
    { label: "type-schools", name: "Loại trường", icon: null, url: routeLink.TYPE_SCHOOLS + routePath.LIST  },
    { label: "regions", name: "Tỉnh thành", icon: null, url: routeLink.REGIONS + routePath.LIST  },
    { label: "job-names", name: "Loại công việc", icon: null, url: routeLink.JOB_NAMES + routePath.LIST },
    { label: "skills", name: "Kỹ năng", icon: null, url: routeLink.SKILLS + routePath.LIST },
    { label: "job-groups", name: "Nhóm công việc", icon: null, url: routeLink.JOB_GROUPS + routePath.LIST },
    { label: "branches", name: "Nhóm ngành", icon: null, url: routeLink.BRANCHES + routePath.LIST },
    { label: "annou-types", name: "Loại bài viết", icon: null, url: routeLink.ANNOU_TYPE + routePath.LIST },

    { label: "event", name: "Sự kiện", icon: null, url: routeLink.EVENT + routePath.LIST },
    // User
    { label: "user-controller", name: "Quản lý người dùng", icon: null, url: routeLink.USER_CONTROLLER + routePath.LIST },
    { label: "em-controller", name: "Quản lý NTD", icon: null, url: routeLink.EM_CONTROLLER + routePath.LIST },
    { label: "em-branches", name: "Danh sách chi nhánh", icon: null, url: routeLink.EM_BRANCHES + routePath.LIST },
    { label: "schools", name: "Danh sách trường", icon: null, url: routeLink.SCHOOLS + routePath.LIST },
    { label: "students", name: "Danh sách sinh viên", icon: null, url: routeLink.STUDENTS + routePath.LIST },
    { label: "job-announcements", name: "Quản lí bài đăng", icon: null, url: routeLink.JOB_ANNOUNCEMENTS + routePath.LIST },
    { label: "candidates", name: "Hồ sơ ứng viên", icon: null, url: routeLink.CANDIDATES + routePath.LIST },
    { label: "partner", name: "Cộng tác viên", icon: null, url: routeLink.PARTNER + routePath.LIST },
    // Role
    { label: "role-admins", name: "Phân quyền", icon: null, url: routeLink.ROLES_ADMIN + routePath.LIST },
    { label: "admin-accounts", name: "Tài khoản admin", icon: null, url: routeLink.ADMIN_ACCOUNTS + routePath.LIST },
];

export interface IBrk {
    label?: string;
    name?: string;
    icon?: string;
    url?: string;
    disable?: boolean;
};