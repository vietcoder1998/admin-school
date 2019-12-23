export const EXCEPTION = {
    CODE: {
        MISSING_REQUEST_PARAMSBAD_REQUEST: 4001 , //thiếu request param"
        INVALID_OR_MISSING_REQUEST_BODYBAD_REQUEST: 4002 , //request body thiếu hoặc không hợp lệ"
        FIELD_VALIDATION_ERRORBAD_REQUEST: 4003 , //lỗi validation trường thông tin"

        AUTHENTICATION_REQUIREDUNAUTHORIZED: 4011 , //truy cập yêu cầu access token để xác thực"
        WRONG_CLIENT_ID_OR_SECRETUNAUTHORIZED: 4012 , //client id hoặc secret không đúng"
        WRONG_USERNAME_OR_PASSWORDUNAUTHORIZED: 4013 , //sai tên đăng nhập hoặc mật khẩu"
        INVALID_TOKENUNAUTHORIZED: 4014, //token không hợp lệ"
        EXPIRED_TOKENUNAUTHORIZED: 4015, //token đã hết hạn"
        USER_BANNEDUNAUTHORIZED: 4016, //tài khoản đã bị vô hiệu hóa"
        ROLE_NOT_ALLOWEDUNAUTHORIZED: 4017, //quyền hiện tại không được phép truy cập"
        CANNOT_MODIFY_ROOT_ACCESS_GRANTUNAUTHORIZED: 4018, //không thể thay đổi quyền ttuy cập của ROOT"

        TOKEN_CANNOT_ACCESS_THIS_RESOURCE_SERVER: 4031, //token không có quyền truy cập tài nguyên trên máy chủ này"
        JOB_HIDDEN: 4032, //bài đăng đã bị tạm ẩn"
        JOB_DISABLED: 4033, //bài đăng tạm thời bị gỡ xuống"
        JOB_EXPIRED: 4034, //bài đăng đã hết thời hạn"
        JOB_APPLY_REJECTED: 4035, //yêu cầu ứng tuyển đã bị từ chối"
        JOB_APPLIED: 4036, //đã gủi yêu cầu ứng tuyển"
        NO_ACCEPTED_APPLIED_JOB: 4037, //cần được chấp nhận ít nhất 01 yêu cầu ứng tuyển để có thể đánh giá nhà tuyển dụng"

        //404x Not found
        USER_USER_NOT_FOUND: 4041, //không tìm thấy người dùng"
        JOB_USER_NOT_FOUND: 4042, //không tìm thấy bài đăng"
        CANDIDATE_USER_NOT_FOUND: 4043, //tài khoản ứng viên đã bị xóa"
        REGION_USER_NOT_FOUND: 4044, //không tìm thấy tỉnh/thành phố"
        CANDIDATE_EDUCATION_USER_NOT_FOUND: 4045, //không tìm thấy học vấn"
        EMPLOYER_USER_NOT_FOUND: 4046, //không tìm thấy nhà tuyển dụng"
        RATING_USER_NOT_FOUND: 4047, //không tìm thấy đánh giá"
        CANDIDATE_EXPERIENCE_USER_NOT_FOUND: 4048, //không tìm thấy kinh nghiệm"
        JOB_GROUP_USER_NOT_FOUND: 4049, //không tìm thấy nhóm công việc"
        LANGUAGE_USER_NOT_FOUND: 40410 , //không tìm thấy ngôn ngữ"
        CANDIDATE_LANGUAGE_SKILL_USER_NOT_FOUND: 40411 , //không tìm thấy trình độ ngoại ngữ"
        SKILL_USER_NOT_FOUND: 40412 , //không tìm thấy kỹ năng"
        OFFERED_JOB_USER_NOT_FOUND: 40413 , //không tìm thấy lời mời ứng tuyển"

        //409x Conflict
        CLIENT_ID_EXISTSCONFLICT: 4091 , //client id đã tồn tại"
        USERNAME_EXISTSCONFLICT: 4092 , //tên đăng nhập đã tồn tại"
        ROLE_EXISTSCONFLICT: 4093 , //quyễn đã tồn tại"
        CANDIDATE_EXISTSCONFLICT: 4094 , //tài khoản ứng viên đã tồn tại"
        SAVED_JOB_EXISTSCONFLICT: 4095 , //bài đăng đã được lưu"
        SKILL_EXISTSCONFLICT: 4096 , //kỹ năng đã tồn tại"

        //500x Internal server error
        UNEXPECTED_ERROR_OCCURREDINTERNAL_SERVER_ERROR: 500 , //lỗi hệ thống")
    },

    MESSAGE: {
        MISSING_REQUEST_PARAMSBAD_REQUEST: "Thiếu request param",
        INVALID_OR_MISSING_REQUEST_BODYBAD_REQUEST: "request body thiếu hoặc không hợp lệ",
        FIELD_VALIDATION_ERRORBAD_REQUEST: "lỗi validation trường thông tin",
        AUTHENTICATION_REQUIREDUNAUTHORIZED: "Truy cập yêu cầu access token để xác thực",
        WRONG_CLIENT_ID_OR_SECRETUNAUTHORIZED: "Client id hoặc secret không đúng",
        WRONG_USERNAME_OR_PASSWORDUNAUTHORIZED: "sai tên đăng nhập hoặc mật khẩu",
        INVALID_TOKENUNAUTHORIZED: "Token không hợp lệ",
        EXPIRED_TOKENUNAUTHORIZED: "Token đã hết hạn",
        USER_BANNEDUNAUTHORIZED: "Tài khoản đã bị vô hiệu hóa",
        ROLE_NOT_ALLOWEDUNAUTHORIZED: "quyền hiện tại không được phép truy cập",
        CANNOT_MODIFY_ROOT_ACCESS_GRANTUNAUTHORIZED: "Không thể thay đổi quyền ttuy cập của ROOT",
        TOKEN_CANNOT_ACCESS_THIS_RESOURCE_SERVER: "Token không có quyền truy cập tài nguyên trên máy chủ này",
        JOB_HIDDEN: "Bài đăng đã bị tạm ẩn",
        JOB_DISABLED: "Bài đăng tạm thời bị gỡ xuống",
        JOB_EXPIRED: "Bài đăng đã hết thời hạn",
        JOB_APPLY_REJECTED: "Yêu cầu ứng tuyển đã bị từ chối",
        JOB_APPLIED: "đã gủi yêu cầu ứng tuyển",
        NO_ACCEPTED_APPLIED_JOB: "Cần được chấp nhận ít nhất  yêu cầu ứng tuyển để có thể đánh giá nhà tuyển dụng",
        USER_USER_NOT_FOUND: "Không tìm thấy người dùng",
        JOB_USER_NOT_FOUND: "Không tìm thấy bài đăng",
        CANDIDATE_USER_NOT_FOUND: "Tài khoản ứng viên đã bị xóa",
        REGION_USER_NOT_FOUND: "Không tìm thấy tỉnh/thành phố",
        CANDIDATE_EDUCATION_USER_NOT_FOUND: "Không tìm thấy học vấn",
        EMPLOYER_USER_NOT_FOUND: "Không tìm thấy nhà tuyển dụng",
        RATING_USER_NOT_FOUND: "Không tìm thấy đánh giá",
        CANDIDATE_EXPERIENCE_USER_NOT_FOUND: "Không tìm thấy kinh nghiệm",
        JOB_GROUP_USER_NOT_FOUND: "Không tìm thấy nhóm công việc",
        LANGUAGE_USER_NOT_FOUND: "Không tìm thấy ngôn ngữ",
        CANDIDATE_LANGUAGE_SKILL_USER_NOT_FOUND: "Không tìm thấy trình độ ngoại ngữ",
        SKILL_USER_NOT_FOUND: "Không tìm thấy kỹ năng",
        OFFERED_JOB_USER_NOT_FOUND: "Không tìm thấy lời mời ứng tuyển",
        CLIENT_ID_EXISTSCONFLICT: "Client id đã tồn tại",
        USERNAME_EXISTSCONFLICT: "Tên đăng nhập đã tồn tại",
        ROLE_EXISTSCONFLICT: "quyễn đã tồn tại",
        CANDIDATE_EXISTSCONFLICT: "Tài khoản ứng viên đã tồn tại",
        SAVED_JOB_EXISTSCONFLICT: "Bài đăng đã được lưu",
        SKILL_EXISTSCONFLICT: "Kỹ năng đã tồn tại",
        UNEXPECTED_ERROR_OCCURREDINTERNAL_SERVER_ERROR: "lỗi hệ thống",
    }
}