module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Loại commit hợp lệ
        'type-enum': [
            2,
            'always',
            [
                'feat',     // Tính năng mới
                'fix',      // Sửa lỗi
                'docs',     // Cập nhật tài liệu
                'style',    // Format code (không ảnh hưởng logic)
                'refactor', // Tái cấu trúc code
                'perf',     // Cải thiện hiệu năng
                'test',     // Thêm/sửa test
                'build',    // Thay đổi build system
                'ci',       // Thay đổi CI/CD
                'chore',    // Công việc vặt (cập nhật dependencies)
                'revert',   // Hoàn tác commit trước
            ],
        ],
        // Tiêu đề commit tối đa 72 ký tự
        'header-max-length': [2, 'always', 72],
        // Loại commit phải viết thường
        'type-case': [2, 'always', 'lower-case'],
        // Subject không được để trống
        'subject-empty': [2, 'never'],
        // Type không được để trống
        'type-empty': [2, 'never'],
    },
};
