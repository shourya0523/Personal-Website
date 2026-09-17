// Add published entries here. Keeping content separate makes the archive easy to extend.
export const blogPosts = []

export const blogTags = ['All', ...new Set(blogPosts.flatMap(post => post.tags))]
