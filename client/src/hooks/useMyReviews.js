import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "../api/axios.js";

const useMyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/reviews/my");
      setReviews(res.data);
    } catch (err) {
      setError("Failed to load your reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await axios.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (review) => {
    setEditModal(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const closeEditModal = () => {
    setEditModal(null);
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      const res = await axios.put(`/reviews/${editModal._id}`, {
        rating: editRating,
        comment: editComment,
      });
      toast.success("Review updated");
      setReviews((prev) =>
        prev.map((r) => (r._id === editModal._id ? res.data.review : r))
      );
      closeEditModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update review");
    } finally {
      setSavingEdit(false);
    }
  };

  return {
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
  };
};

export default useMyReviews;