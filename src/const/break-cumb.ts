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
    USER_CONTROLLER: '/user-controller',
    EM_CONTROLLER: '/em-controller',
    EM_BRANCHES: '/em-branches',
    SCHOOLS: '/schools',
    STUDENTS: '/students',
    JOB_ANNOUNCEMENTS: '/job-announcements',
    ANNOUNCEMENT: '/announcements',
    CANDIDATES: '/candidates',
    PARTNER: '/partner',
    EVENT: '/event',
    IN_EVENT: '/in-event',
    EMPLOYER: '/employers',
    WORKING_TOOL: '/working-tools',
    CONNECT: '/connect',
    EM_SCHOOL: '/em-school'
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
    WORKING_TOOL: routePath.ADMIN + routePath.DATA + routePath.WORKING_TOOL,

    // role
    ROLES_ADMIN: routePath.ADMIN + routePath.ROLES + routePath.ROLES_ADMIN,
    ADMIN_ACCOUNTS: routePath.ADMIN + routePath.ROLES + routePath.ADMIN_ACCOUNTS,

    // job management
    PENDING_JOBS: routePath.ADMIN + routePath.JOBS + routePath.PENDING_JOBS,
    JOB_ANNOUNCEMENTS: routePath.ADMIN + routePath.JOBS + routePath.JOB_ANNOUNCEMENTS,
    // announcement
    ANNOUCEMENT: routePath.ADMIN + routePath.ANNOUNCEMENT,
    //event
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

    // Connect
    EM_SCHOOL: routePath.ADMIN + routePath.CONNECT + routePath.EM_SCHOOL,
};

export const breakCumb = [
    // SubMenu
    { label: "jobs", name: "Tuyển dụng", icon: null, url: routePath.JOBS, disable: true },
    { label: "create", name: "Tạo mới", icon: null, url: routePath.CREATE, disable: true },
    { label: "detail", name: "Chi tiết", icon: null, url: routePath.DETAIL, disable: true },
    { label: "list", name: "Danh sách", icon: null, url: routePath.LIST, disable: true },
    { label: "fix", name: "Chỉnh sửa", icon: null, url: routePath.FIX, disable: true },
    { label: "data", name: "Danh mục dữ liêu", icon: "database", url: routePath.DATA, disable: true },
    { label: "role", name: "Quản trị", icon: null, url: routePath.ROLES, disable: true },
    { label: "user", name: "Quản lý tài khoản", icon: null, url: routePath.USER, disable: true },
    { label: "pending-jobs", name: "Bài đăng đang chờ", icon: null, url: routePath.PENDING_JOBS, disable: true },
    { label: "announcements", name: "Bài viết", icon: null, url: routePath.ANNOUNCEMENT, disable: true },
    { label: "connect", name: "Kết nối", icon: null, url: routePath.CONNECT, disable: true },
    // annoucement
    { label: "annoucement", name: "Quản lý bài viết", icon: null, url: routeLink.ANNOUCEMENT + routePath.LIST, disable: true },
    // pendingjob
    { label: "pending-jobs", name: "Xét duyệt ", icon: null, url: routeLink.PENDING_JOBS + routePath.LIST, disable: true },
    // Data
    { label: "languages", name: "Ngôn ngữ", icon: null, url: routeLink.LANGUAGES + routePath.LIST, disable: true },
    { label: "majors", name: "Loại ngành nghề", icon: null, url: routeLink.MAJORS + routePath.LIST, disable: true },
    { label: "type-schools", name: "Loại trường", icon: null, url: routeLink.TYPE_SCHOOLS + routePath.LIST, disable: true },
    { label: "regions", name: "Tỉnh thành", icon: null, url: routeLink.REGIONS + routePath.LIST, disable: true },
    { label: "job-names", name: "Loại công việc", icon: null, url: routeLink.JOB_NAMES + routePath.LIST, disable: true },
    { label: "skills", name: "Kỹ năng", icon: null, url: routeLink.SKILLS + routePath.LIST, disable: true },
    { label: "job-groups", name: "Nhóm công việc", icon: null, url: routeLink.JOB_GROUPS + routePath.LIST, disable: true },
    { label: "branches", name: "Nhóm ngành", icon: null, url: routeLink.BRANCHES + routePath.LIST, disable: true },
    { label: "annou-types", name: "Loại bài viết", icon: null, url: routeLink.ANNOU_TYPE + routePath.LIST, disable: true },
    { label: "event", name: "Sự kiện", icon: null, url: routeLink.EVENT + routePath.LIST, disable: true },
    { label: "working-tools", name: "Công cụ", icon: null, url: routeLink.WORKING_TOOL + routePath.LIST, disable: true },
    // User
    { label: "user-controller", name: "Người dùng", icon: null, url: routeLink.USER_CONTROLLER + routePath.LIST, disable: true },
    { label: "em-controller", name: "Nhà tuyển dụng", icon: null, url: routeLink.EM_CONTROLLER + routePath.LIST, disable: true },
    { label: "em-branches", name: "Chi nhánh", icon: null, url: routeLink.EM_BRANCHES + routePath.LIST, disable: true },
    { label: "schools", name: "Nhà trường trường", icon: null, url: routeLink.SCHOOLS + routePath.LIST, disable: true },
    { label: "students", name: "Sinh viên", icon: null, url: routeLink.STUDENTS + routePath.LIST, disable: true },
    { label: "job-announcements", name: "Bài đăng", icon: null, url: routeLink.JOB_ANNOUNCEMENTS + routePath.LIST, disable: true },
    { label: "candidates", name: "Hồ sơ ứng viên", icon: null, url: routeLink.CANDIDATES + routePath.LIST, disable: true },
    { label: "partner", name: "Cộng tác viên", icon: null, url: routeLink.PARTNER + routePath.LIST, disable: true },
    // Role
    { label: "role-admins", name: "Phân quyền", icon: null, url: routeLink.ROLES_ADMIN + routePath.LIST, disable: true },
    { label: "admin-accounts", name: "Tài khoản admin", icon: null, url: routeLink.ADMIN_ACCOUNTS + routePath.LIST, disable: true },
    // Connect
    { label: "em-school", name: "NTD - Nhà trường", icon: null, url: routeLink.EM_SCHOOL + routePath.LIST, disable: true },
];

export interface IBrk {
    label?: string;
    name?: string;
    icon?: string;
    url?: string;
    disable?: boolean;
};

export const arrRoute = breakCumb.forEach((item: any, index) => ({ index, label: item.label, name: item.name }));
export const label = [

];

export const routeOption = [
    {
        value: routePath.JOBS,
        label: 'Bài đăng',
        children: [
            {
                value: routePath.JOB_ANNOUNCEMENTS,
                label: "Bài đăng",
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.PENDING_JOBS,
                label: 'Xét duyệt',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
        ],
    },
    {
        value: routePath.DATA,
        label: 'Dữ liệu',
        children: [
            {
                value: routePath.LANGUAGES,
                label: 'Ngôn ngữ',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.MAJORS,
                label: 'Chuyên ngành',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.REGIONS,
                label: 'Tỉnh thành',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.JOB_NAMES,
                label: 'Loại công việc',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.SCHOOLS,
                label: 'Loại trường',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.SKILLS,
                label: 'Loại kỹ năng',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.JOB_GROUPS,
                label: 'Nhóm công việc',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.BRANCHES,
                label: 'Nhóm ngành',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.ANNOU_TYPE,
                label: 'Nhóm bài viết',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.WORKING_TOOL,
                label: 'Công cụ',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
        ],
    },
    {
        value: routePath.EVENT,
        label: 'Sự kiện',
        children: [
            {
                value: routePath.LIST,
                label: 'Danh sách',
            },
        ],
    },
    {
        value: routePath.ANNOUNCEMENT,
        label: 'Bài viết',
        children: [
            {
                value: routePath.LIST,
                label: 'Danh sách',
            },
        ],
    },
    {
        value: routePath.ROLES,
        label: 'Quản trị',
        children: [
            {
                value: routePath.ADMIN_ACCOUNTS,
                label: 'Admin',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.ROLES_ADMIN,
                label: 'Phân quyền',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
        ],
    },
    {
        value: routePath.USER,
        label: 'Tài khoản',
        children: [
            {
                value: routePath.USER_CONTROLLER,
                label: 'Người dùng',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.EM_CONTROLLER,
                label: 'Nhà tuyển dụng',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.SCHOOLS,
                label: 'Nhà trường',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
            {
                value: routePath.STUDENTS,
                label: 'Sinh viên',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
        ],
    },
    {
        value: routePath.CONNECT,
        label: 'Kết nối',
        children: [
            {
                value: routePath.EM_SCHOOL,
                label: 'Nhà trường - doanh nghiệp',
                children: [
                    {
                        value: routePath.LIST,
                        label: 'Danh sách',
                    },
                ],
            },
        ],
    },
];

export const mapApiFolder = (arr?: Array<String>) => {
    if (arr && arr.length > 0) {
        let route = routePath.ADMIN;
        arr.forEach((item, index) => { route += item });
        window.location.href = route;
        return route;
    }
}
