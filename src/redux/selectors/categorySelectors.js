// Category selectors for accessing category state from components

// Get all categories from state
export const selectAllCategories = (state) => state.categories.items;

// Get a specific category by ID
export const selectCategoryById = (state, categoryId) => 
  state.categories.items.find(category => category.id.toString() === categoryId.toString());

// Get loading state for category operations
export const selectCategoriesLoading = (state) => state.categories.loading;

// Get error state for category operations
export const selectCategoriesError = (state) => state.categories.error;

// Get categories sorted alphabetically
export const selectCategoriesSortedByName = (state) => 
  [...state.categories.items].sort((a, b) => a.name.localeCompare(b.name));

// Get categories with book count (if available in state)
export const selectCategoriesWithBookCount = (state) => 
  state.categories.items.map(category => ({
    ...category,
    bookCount: state.books.items.filter(book => 
      book.categoryId === category.id || 
      book.categories?.some(cat => cat.id === category.id)
    ).length
  }));

// Get popular categories (those with most books)
export const selectPopularCategories = (state) => {
  const categoriesWithCount = selectCategoriesWithBookCount(state);
  return [...categoriesWithCount]
    .sort((a, b) => b.bookCount - a.bookCount)
    .slice(0, 5);
};

// Get categories for a specific book
export const selectCategoriesByBookId = (state, bookId) => {
  const book = state.books.items.find(book => book.id.toString() === bookId.toString());
  
  if (!book) return [];
  
  // If book has categories array
  if (book.categories && Array.isArray(book.categories)) {
    return book.categories;
  }
  
  // If book only has categoryId
  if (book.categoryId) {
    const category = state.categories.items.find(
      category => category.id.toString() === book.categoryId.toString()
    );
    return category ? [category] : [];
  }
  
  return [];
};