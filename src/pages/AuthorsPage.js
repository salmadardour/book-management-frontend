import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthors, deleteAuthor } from '../redux/slices/AuthorSlice';
import { Link } from 'react-router-dom';

function AuthorsPage() {
  const dispatch = useDispatch();
  const { authors, loading, error } = useSelector(state => state.authors);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  const handleDeleteClick = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!authorToDelete) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteAuthor(authorToDelete.id)).unwrap();
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting author:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Authors</h1>
      <div className="top-actions">
        <Link to="/authors/create" className="add-button">+ Add Author</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="items-list">
          {authors.map(author => (
            <li key={author.id} className="list-item card">
              <div>
                <h3>{author.name}</h3>
              </div>
              {isAuthenticated && (
                <div className="list-actions">
                  <button className="delete-button" onClick={() => handleDeleteClick(author)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete author "{authorToDelete?.name}"?</p>
            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="delete-button" 
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorsPage;