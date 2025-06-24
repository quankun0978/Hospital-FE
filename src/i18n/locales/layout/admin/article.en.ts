 export default {
  form: {
    title: 'Article Title',
    titlePlaceholder: 'Enter article title',
    titleRequired: 'Please enter article title',
    slug: 'Slug (SEO friendly URL)',
    slugPlaceholder: 'Slug will be generated automatically',
    generateSlug: 'Regenerate',
    category: 'Category',
    categoryPlaceholder: 'Select category',
    publishDate: 'Publish Date',
    publishDatePlaceholder: 'Select publish date',
    description: 'Short Description',
    descriptionPlaceholder: 'Enter short description for the article...',
    content: 'Article Content',
    contentPlaceholder: 'Enter article content...',
    contentRequired: 'Please enter article content',
    publishDateRequired: 'Please select publish date',
    cancel: 'Cancel',
    create: 'Publish',
    update: 'Update',
    creating: 'Creating...',
    updating: 'Updating...'
  },
  management: {
    title: 'Article Management',
    addNew: 'Add Article',
    refresh: 'Refresh',
    searchPlaceholder: 'Search by title, author...',
    noArticles: 'No articles found',
    columns: {
      title: 'Title',
      author: 'Author',
      status: 'Status',
      publishDate: 'Publish Date',
      actions: 'Actions'
    },
    status: {
      published: 'Published'
    },
    actions: {
      view: 'View article',
      edit: 'Edit',
      delete: 'Delete'
    },
    pagination: {
      showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} articles`,
      pageSizeOptions: ['10', '20', '50', '100']
    },
    deleteModal: {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete?',
      description: 'Article {title} will be permanently deleted. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  },
  categories: {
    'tin-tuc': 'News',
    'suc-khoe': 'Health',
    'kien-thuc-y-khoa': 'Medical Knowledge',
    'chuyen-gia': 'Expert',
    'dich-vu': 'Services',
    'khac': 'Other'
  },
  messages: {
    createSuccess: 'Article created successfully',
    updateSuccess: 'Article updated successfully',
    deleteSuccess: 'Article deleted successfully',
    loadError: 'Error loading articles',
    createError: 'Error creating article',
    updateError: 'Error updating article',
    deleteError: 'Error deleting article',
    slugError: 'Error generating slug',
    noSlugWarning: 'Article has no slug'
  },
  breadcrumbs: {
    management: 'Article Management',
    create: 'Add New',
    edit: 'Edit'
  }
}; 