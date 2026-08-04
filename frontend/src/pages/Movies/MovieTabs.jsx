import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar, FaThumbsUp, FaTrash, FaUser, FaComments, FaCheckCircle } from "react-icons/fa";
import {
  useGetMovieReviewsQuery,
  useAddMovieReviewMutation,
  useToggleLikeReviewMutation,
  useDeleteReviewMutation,
} from "../../redux/api/movies";

const MovieTabs = ({ movieId, userInfo }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data, isLoading, refetch } = useGetMovieReviewsQuery(movieId, { skip: !movieId });
  const [addReview, { isLoading: isSubmitting }] = useAddMovieReviewMutation();
  const [toggleLike] = useToggleLikeReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];
  const totalReviews = data?.totalReviews || 0;
  const averageRating = data?.averageRating || 0;
  const ratingCounts = data?.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    try {
      await addReview({ id: movieId, rating, comment }).unwrap();
      toast.success("Review submitted successfully!");
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to submit review.");
    }
  };

  const handleLike = async (reviewId) => {
    if (!userInfo) {
      toast.info("Please sign in to upvote reviews.");
      return;
    }

    try {
      await toggleLike({ movieId, reviewId }).unwrap();
      refetch();
    } catch (err) {
      toast.error("Failed to upvote review.");
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview({ movieId, reviewId }).unwrap();
        toast.success("Review deleted.");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete review.");
      }
    }
  };

  return (
    <div className="mt-16 border-t border-zinc-800 pt-10 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2.5 tracking-tight">
            <FaComments className="text-red-600 text-xl" />
            <span>Audience Reviews & Ratings</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Community feedback and ratings powered by MongoDB.
          </p>
        </div>

        {/* Rating Summary Pill */}
        {totalReviews > 0 && (
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl shadow-lg">
            <div className="text-3xl font-black text-amber-400 flex items-center gap-1">
              <span>{averageRating}</span>
              <FaStar className="text-xl" />
            </div>
            <div className="text-xs text-gray-400 border-l border-zinc-800 pl-3">
              <p className="font-bold text-white text-sm">{totalReviews} Review{totalReviews > 1 ? "s" : ""}</p>
              <p>Overall Rating Score</p>
            </div>
          </div>
        )}
      </div>

      {/* Rating Breakdown Distribution Graph */}
      {totalReviews > 0 && (
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 mb-8 max-w-xl space-y-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Rating Breakdown</h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-10 font-semibold text-gray-300 flex items-center gap-1">
                  <span>{star}</span>
                  <FaStar className="text-amber-400 text-[10px]" />
                </span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-gray-400 font-mono text-[11px]">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Write a Review Section */}
      {userInfo ? (
        <form onSubmit={submitHandler} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 mb-10 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Write Your Review</h3>

          {/* Clickable 5-Star Rating Selector */}
          <div>
            <label className="text-xs text-gray-400 font-semibold block mb-1.5">Your Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-125 focus:outline-none"
                >
                  <FaStar
                    className={`text-2xl transition-colors ${
                      star <= (hoverRating || rating) ? "text-amber-400 drop-shadow-md" : "text-zinc-700"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 ml-2">{hoverRating || rating}.0 / 5.0</span>
            </div>
          </div>

          {/* Comment Area */}
          <div>
            <label className="text-xs text-gray-400 font-semibold block mb-1.5">Review Thoughts</label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of the plot, characters, pacing, or visuals?"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-red-600 transition resize-none placeholder-gray-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-10 text-center">
          <p className="text-gray-300 text-sm">
            Want to share your thoughts?{" "}
            <Link to="/login" className="text-red-500 font-bold hover:underline">
              Sign In to Write a Review
            </Link>
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-zinc-950/40 rounded-2xl border border-zinc-800/80 text-gray-400 text-sm">
          No reviews written yet. Be the first to review this title!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isLiked = userInfo && rev.likes?.some((id) => id === userInfo._id || id?.toString() === userInfo._id?.toString());
            const isAuthor = userInfo && (rev.user === userInfo._id || rev.user?.toString() === userInfo._id?.toString());

            return (
              <div
                key={rev._id}
                className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 transition hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-500 font-bold overflow-hidden flex-shrink-0">
                      {rev.userAvatar ? (
                        <img src={rev.userAvatar} alt={rev.username} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{rev.username}</h4>
                        <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <FaCheckCircle className="text-[9px]" /> Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center text-amber-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < rev.rating ? "text-amber-400" : "text-zinc-700"} />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {new Date(rev.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(rev._id)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                        isLiked
                          ? "bg-red-600/20 text-red-400 border-red-500/40 font-bold"
                          : "bg-zinc-800/60 text-gray-400 border-zinc-700/60 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      <FaThumbsUp className="text-[11px]" />
                      <span>{rev.likes?.length || 0}</span>
                    </button>

                    {(isAuthor || userInfo?.isAdmin) && (
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-2 text-gray-500 hover:text-red-400 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 transition"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-200 mt-3 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieTabs;