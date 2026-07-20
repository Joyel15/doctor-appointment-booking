import { useState } from "react";
import Spinner from "../../components/common/Spinner.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import useMyReviews from "../../hooks/useMyReviews.js";

const MyReviews = () => {
  const {
    reviews,
    loading,
    error,
    deletingId,
    editModal,
    editRating,
    setEditRating,
    editComment,
    setEditComment,
    savingEdit,
    handleDelete,
    openEditModal,
    closeEditModal,
    handleSaveEdit,
  } = useMyReviews();

  // Tracks which review is pending delete confirmation
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const confirmDelete = () => {
    handleDelete(reviewToDelete);
    setReviewToDelete(null);
  };

  if (loading) {
    return <div className="px-4 py-10"><Spinner /></div>;
  }

  if (error) {
    return <div className="px-4 py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        My Reviews
      </h1>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
          You haven't written any reviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Dr. {review.doctorId?.doctorId?.name || "N/A"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => openEditModal(review)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setReviewToDelete(review._id)}
                    disabled={deletingId === review._id}
                    className="text-red-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === review._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <p className="text-yellow-500 text-sm mb-2">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>

              {review.comment && (
                <p className="text-gray-700 text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Review
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className={
                      star <= editRating ? "text-yellow-500" : "text-gray-300"
                    }
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="editComment"
              >
                Comment
              </label>
              <textarea
                id="editComment"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!reviewToDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
};

export default MyReviews;