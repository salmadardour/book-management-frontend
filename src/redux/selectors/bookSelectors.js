// Book selectors for accessing book state from components

// Get all books from state
export const selectAllBooks = (state) => state.books.items;

// Get a specific book by ID
export const selectBookById = (state, bookId) => 
  state.books.items.find(book => book.id.toString() === bookId.toString());

// Get loading state for book operations
export const selectBooksLoading = (state) => state.books.loading;

// Get error state for book operations
export const selectBooksError = (state) => state.books.error;

// Get books by category ID
export const selectBooksByCategory = (state, categoryId) => 
  state.books.items.filter(book => 
    book.categoryId?.toString() === categoryId.toString() || 
    book.categories?.some(cat => cat.id.toString() === categoryId.toString())
  );

// Get books by author ID
export const selectBooksByAuthor = (state, authorId) => 
  state.books.items.filter(book => 
    book.authorId?.toString() === authorId.toString() || 
    book.authors?.some(author => author.id.toString() === authorId.toString())
  );

// Get books by publisher ID
export const selectBooksByPublisher = (state, publisherId) => 
  state.books.items.filter(book => 
    book.publisherId?.toString() === publisherId.toString()
  );

// Get featured books (e.g., highly rated, newest, etc.)
export const selectFeaturedBooks = (state) => 
  state.books.items
    .filter(book => book.featured || book.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

// Get newest books
export const selectNewestBooks = (state) => 
  [...state.books.items]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 8);