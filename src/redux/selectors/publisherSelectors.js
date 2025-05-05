// Publisher selectors for accessing publisher state from components

// Get all publishers from state
export const selectAllPublishers = (state) => state.publishers.items;

// Get a specific publisher by ID
export const selectPublisherById = (state, publisherId) => 
  state.publishers.items.find(publisher => publisher.id.toString() === publisherId.toString());

// Get loading state for publisher operations
export const selectPublishersLoading = (state) => state.publishers.loading;

// Get error state for publisher operations
export const selectPublishersError = (state) => state.publishers.error;

// Get publishers sorted alphabetically
export const selectPublishersSortedByName = (state) => 
  [...state.publishers.items].sort((a, b) => a.name.localeCompare(b.name));

// Get publishers with book count
export const selectPublishersWithBookCount = (state) => 
  state.publishers.items.map(publisher => ({
    ...publisher,
    bookCount: state.books.items.filter(
      book => book.publisherId?.toString() === publisher.id.toString()
    ).length
  }));

// Get top publishers by book count
export const selectTopPublishers = (state) => {
  const publishersWithCount = selectPublishersWithBookCount(state);
  return [...publishersWithCount]
    .sort((a, b) => b.bookCount - a.bookCount)
    .slice(0, 5);
};

// Get publisher for a specific book
export const selectPublisherByBookId = (state, bookId) => {
  const book = state.books.items.find(book => book.id.toString() === bookId.toString());
  if (!book || !book.publisherId) return null;
  
  return state.publishers.items.find(
    publisher => publisher.id.toString() === book.publisherId.toString()
  );
};

// Get publishers with filtering by name
export const selectPublishersByNameFilter = (state, nameFilter) => {
  if (!nameFilter) return state.publishers.items;
  
  const lowercaseFilter = nameFilter.toLowerCase();
  return state.publishers.items.filter(
    publisher => publisher.name.toLowerCase().includes(lowercaseFilter)
  );
};