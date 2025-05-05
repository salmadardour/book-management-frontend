import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import bookReducer from './slices/BookSlice';
import authorReducer from './slices/AuthorSlice';
import categoryReducer from './slices/CategorySlice';
import publisherReducer from './slices/PublisherSlice';
import reviewReducer from './slices/ReviewSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    authors: authorReducer,
    categories: categoryReducer,
    publishers: publisherReducer,
    reviews: reviewReducer,
  },
});

export default store;