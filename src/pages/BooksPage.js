import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, deleteBook } from '../redux/slices/BookSlice';

function BooksPage() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector(state => state.books);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const categories = [...new Set(books.map(b => b.categoryName).filter(Boolean))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.authorName && book.authorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === '' || book.categoryName === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteBook(bookToDelete.id)).unwrap();
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting book:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderListView = () => (
    <div className="items-list">
      {filteredBooks.map(book => (
        <div key={book.id} className="list-item card">
          <div>
            <h3>{book.title}</h3>
            <p className="book-author">By {book.authorName}</p>
            <p className="book-category">{book.categoryName}</p>
          </div>
          <div className="list-actions">
            <Link to={`/books/${book.id}`} className="view-button">View</Link>
            {isAuthenticated && (
              <div className="list-actions"><button className="delete-button" onClick={() => handleDeleteClick(book)}>Delete</button></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="page-container">
      <h1>My Book Collection</h1><div className="top-actions">
      <Link to="/books/create" className="add-button">+ Add Book</Link></div>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat}>{cat}</option>
        ))}
      </select>
      {loading ? <p>Loading...</p> : renderListView()}
    </div>
  );
}

export default BooksPage;