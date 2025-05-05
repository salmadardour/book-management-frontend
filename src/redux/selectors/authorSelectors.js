// Author selectors for accessing author state from components

// Get all authors from state
export const selectAllAuthors = (state) => state.authors.items;

// Get a specific author by ID
export const selectAuthorById = (state, authorId) => 
  state.authors.items.find(author => author.id.toString() === authorId.toString());

// Get loading state for author operations
export const selectAuthorsLoading = (state) => state.authors.loading;

// Get error state for author operations
export const selectAuthorsError = (state) => state.authors.error;

// Get authors sorted alphabetically by name
export const selectAuthorsSortedByName = (state) => 
  [...state.authors.items].sort((a, b) => a.name.localeCompare(b.name));

// Get popular authors (e.g., those with most books)
export const selectPopularAuthors = (state) => 
  [...state.authors.items]
    .sort((a, b) => (b.bookCount || 0) - (a.bookCount || 0))
    .slice(0, 5);

// Get author by book ID - assuming books have authorId property
export const selectAuthorByBookId = (state, bookId) => {
  const book = state.books.items.find(book => book.id.toString() === bookId.toString());
  if (!book || !book.authorId) return null;
  
  return state.authors.items.find(author => author.id.toString() === book.authorId.toString());
};

// Get authors with filtering by name
export const selectAuthorsByNameFilter = (state, nameFilter) => {
  if (!nameFilter) return state.authors.items;
  
  const lowercaseFilter = nameFilter.toLowerCase();
  return state.authors.items.filter(
    author => author.name.toLowerCase().includes(lowercaseFilter)
  );
};