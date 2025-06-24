export default {
  form: {
    title: 'Tiêu đề bài viết',
    titlePlaceholder: 'Nhập tiêu đề bài viết',
    titleRequired: 'Vui lòng nhập tiêu đề bài viết',
    slug: 'Slug (URL thân thiện)',
    slugPlaceholder: 'Slug sẽ được tạo tự động',
    generateSlug: 'Tạo lại',
    category: 'Danh mục',
    categoryPlaceholder: 'Chọn danh mục',
    publishDate: 'Ngày xuất bản',
    publishDatePlaceholder: 'Chọn ngày xuất bản',
    description: 'Mô tả ngắn',
    descriptionPlaceholder: 'Nhập mô tả ngắn cho bài viết...',
    content: 'Nội dung bài viết',
    contentPlaceholder: 'Nhập nội dung bài viết...',
    contentRequired: 'Vui lòng nhập nội dung bài viết',
    publishDateRequired: 'Vui lòng chọn ngày xuất bản',
    cancel: 'Hủy',
    create: 'Xuất bản',
    update: 'Cập nhật',
    creating: 'Đang tạo...',
    updating: 'Đang cập nhật...'
  },
  management: {
    title: 'Quản lý bài viết',
    addNew: 'Thêm bài viết',
    refresh: 'Làm mới',
    searchPlaceholder: 'Tìm kiếm theo tiêu đề, tác giả...',
    noArticles: 'Không có bài viết nào',
    columns: {
      title: 'Tiêu đề',
      author: 'Tác giả',
      status: 'Trạng thái',
      publishDate: 'Ngày xuất bản',
      actions: 'Thao tác'
    },
    status: {
      published: 'Đã xuất bản'
    },
    actions: {
      view: 'Xem bài viết',
      edit: 'Chỉnh sửa',
      delete: 'Xóa'
    },
    pagination: {
      showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bài viết`,
      pageSizeOptions: ['10', '20', '50', '100']
    },
    deleteModal: {
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa?',
      description: 'Bài viết {title} sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      cancelText: 'Hủy'
    }
  },
  categories: {
    'tin-tuc': 'Tin tức',
    'suc-khoe': 'Sức khỏe',
    'kien-thuc-y-khoa': 'Kiến thức y khoa',
    'chuyen-gia': 'Chuyên gia',
    'dich-vu': 'Dịch vụ',
    'khac': 'Khác'
  },
  messages: {
    createSuccess: 'Tạo bài viết thành công',
    updateSuccess: 'Cập nhật bài viết thành công',
    deleteSuccess: 'Xóa bài viết thành công',
    loadError: 'Lỗi khi tải danh sách bài viết',
    createError: 'Lỗi khi tạo bài viết',
    updateError: 'Lỗi khi cập nhật bài viết',
    deleteError: 'Lỗi khi xóa bài viết',
    slugError: 'Lỗi khi tạo slug',
    noSlugWarning: 'Bài viết chưa có slug'
  },
  breadcrumbs: {
    management: 'Quản lý bài viết',
    create: 'Thêm mới',
    edit: 'Chỉnh sửa'
  }
}; 