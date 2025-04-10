'use client';

import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import useReviewStore from '@/stores/reviewStore';
import useAuthStore from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';

interface ReviewSectionProps {
  promptId: number;
}

export default function ReviewSection({ promptId }: ReviewSectionProps) {
  const { user } = useAuthStore();
  const { 
    promptReviews, 
    userReview, 
    hasReviewPermission,
    isLoading, 
    fetchPromptReviews, 
    fetchUserReview,
    createReview,
    updateReview,
    deleteReview,
    checkPurchaseStatus
  } = useReviewStore();
  
  // Local state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  useEffect(() => {
    fetchPromptReviews(promptId);
    
    if (user) {
      fetchUserReview(promptId);
      checkPurchaseStatus(promptId);
    }
  }, [promptId, user, fetchPromptReviews, fetchUserReview, checkPurchaseStatus]);
  
  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || '');
    }
  }, [userReview]);

  const reviews = promptReviews[promptId] || [];
  
  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && userReview) {
      await updateReview(userReview.id, rating, comment);
    } else {
      await createReview(promptId, rating, comment);
    }
    
    setIsEditing(false);
    setIsFormVisible(false);
  };
  
  // Edit handler
  const handleEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || '');
      setIsEditing(true);
      setIsFormVisible(true);
    }
  };
  
  // Delete handler
  const handleDelete = async () => {
    if (userReview && window.confirm('Are you sure you want to delete your review?')) {
      await deleteReview(userReview.id);
    }
  };
  
  // Function to render rating stars
  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      if (interactive) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => setRating(starValue)}
            className="focus:outline-none"
          >
            {starValue <= rating ? (
              <StarIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-6 w-6 text-yellow-400" />
            )}
          </button>
        );
      } else {
        return starValue <= rating ? (
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" />
        );
      }
    });
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Reviews ({reviews.length})
        </h2>
      </div>
      
      {/* Review form */}
      {user && hasReviewPermission && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {userReview && !isFormVisible ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Your Review</h3>
                  <div className="flex items-center mt-1">{renderStars(userReview.rating)}</div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleEdit}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {userReview.comment && (
                <p className="text-gray-700 dark:text-gray-300 mt-2">{userReview.comment}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Posted {formatDate(userReview.created_at)}
              </p>
            </div>
          ) : !userReview && !isFormVisible ? (
            <button
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                {isEditing ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {renderStars(rating, true)}
                </div>
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="comment" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Comment (optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Share your experience with this prompt"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormVisible(false);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Other reviews */}
      <div className="p-6">
        {reviews.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No reviews yet. Be the first to review this prompt!
          </p>
        )}
        
        {reviews
          .filter(review => !userReview || review.id !== userReview.id) // Don't show user's review twice
          .map(review => (
            <div key={review.id} className="mb-6 last:mb-0">
              <div className="flex items-start mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm mr-3">
                  {review.user_username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {review.user_full_name || review.user_username || 'Anonymous'}
                  </p>
                  <div className="flex items-center mt-1">{renderStars(review.rating)}</div>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </div>
              </div>
              {review.comment && (
                <div className="pl-11">
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              )}
            </div>
          ))}
      </div>
      
      {/* Info message if user is not logged in or hasn't purchased */}
      {user && !hasReviewPermission && !isLoading && (
        <div className="px-6 pb-6">
          <div className="bg-yellow-50 dark:bg-amber-900/30 border border-yellow-200 dark:border-amber-800 rounded-md p-4">
            <div className="flex">
              <div className="text-yellow-700 dark:text-yellow-500">
                <p>
                  You need to purchase this prompt before you can leave a review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!user && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md p-4">
            <div className="flex">
              <div className="text-gray-700 dark:text-gray-300">
                <p>
                  Please <a href="/login" className="text-indigo-600 hover:text-indigo-800">log in</a> to leave a review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
