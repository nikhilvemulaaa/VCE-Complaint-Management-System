import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Star, Send, CheckCircle } from 'lucide-react';
import { Complaint } from '../types';

interface FeedbackModuleProps {
  complaints: Complaint[];
}

interface Feedback {
  id: string;
  complaintId: string;
  rating: number;
  comment: string;
  submittedBy: string;
  submittedAt: string;
  dateSubmitted: string;
  helpful: number;
  notHelpful: number;
}

const FeedbackModule: React.FC<FeedbackModuleProps> = ({ complaints }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitterName, setSubmitterName] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');

  // Load feedbacks from localStorage on component mount
  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('vce-feedbacks');
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  // Save feedbacks to localStorage whenever feedbacks change
  useEffect(() => {
    localStorage.setItem('vce-feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleSubmitFeedback = () => {
    if (!selectedComplaint || rating === 0 || !comment.trim()) {
      alert('Please fill all required fields:\n• Select a resolved complaint\n• Provide a rating (1-5 stars)\n• Write your feedback comment');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      const newFeedback: Feedback = {
        id: `FB-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        complaintId: selectedComplaint,
        rating,
        comment: comment.trim(),
        submittedBy: submitterName.trim() || 'Anonymous',
        submittedAt: new Date().toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        dateSubmitted: new Date().toLocaleDateString('en-IN'),
        helpful: 0,
        notHelpful: 0
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      
      // Reset form
      setSelectedComplaint('');
      setRating(0);
      setComment('');
      setSubmitterName('');
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const handleHelpfulVote = (feedbackId: string, isHelpful: boolean) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            helpful: isHelpful ? feedback.helpful + 1 : feedback.helpful,
            notHelpful: !isHelpful ? feedback.notHelpful + 1 : feedback.notHelpful
          }
        : feedback
    ));
  };

  const getComplaintById = (id: string) => {
    return complaints.find(c => c.id === id);
  };

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Community Feedback</h2>
            <p className="text-purple-100">Share your experience and help improve our services</p>
            <div className="mt-2 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Average Rating: {averageRating} ⭐ ({feedbacks.length} reviews)
              </span>
            </div>
          </div>
          <MessageCircle className="w-16 h-16 text-purple-200" />
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
            <div>
              <p className="text-emerald-800 font-medium">Feedback Submitted Successfully!</p>
              <p className="text-emerald-700 text-sm">
                Thank you for your feedback! Your opinion helps us improve our services and will be visible in the community reviews below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-purple-600">{feedbacks.length}</p>
          <p className="text-sm text-gray-600">Total Feedbacks</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-emerald-600">{averageRating}</p>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-blue-600">{resolvedComplaints.length}</p>
          <p className="text-sm text-gray-600">Resolved Cases</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {feedbacks.reduce((sum, f) => sum + f.helpful, 0)}
          </p>
          <p className="text-sm text-gray-600">Helpful Votes</p>
        </div>
      </div>

      {/* Submit Feedback Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit Your Feedback</h3>
        
        {resolvedComplaints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No resolved complaints available for feedback</p>
            <p className="text-sm mt-2">Resolved complaints will appear here for community feedback</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Resolved Complaint <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedComplaint}
                onChange={(e) => setSelectedComplaint(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a resolved complaint to review</option>
                {resolvedComplaints.map(complaint => (
                  <option key={complaint.id} value={complaint.id}>
                    #{complaint.id.slice(-6)} - {complaint.subject} ({complaint.issueType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                placeholder="Enter your name or leave blank for anonymous"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span> (1-5 stars)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-colors ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">You rated: {rating} star{rating > 1 ? 's' : ''}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with the complaint resolution process..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">{comment.length}/500 characters</p>
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Community Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Community Reviews ({feedbacks.length})</h3>
        
        {feedbacks.length > 0 ? (
          <div className="space-y-6">
            {feedbacks.map((feedback) => {
              const complaint = getComplaintById(feedback.complaintId);
              return (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {feedback.submittedBy}
                        </span>
                        <span className="text-sm text-gray-500">
                          {feedback.submittedAt}
                        </span>
                      </div>
                      {complaint && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-900">
                            Reviewed Complaint: #{complaint.id.slice(-6)}
                          </p>
                          <p className="text-sm text-blue-700">{complaint.subject}</p>
                          <p className="text-xs text-blue-600">{complaint.issueType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{feedback.comment}</p>
                  
                  <div className="flex items-center space-x-4 text-sm border-t border-gray-200 pt-4">
                    <button
                      onClick={() => handleHelpfulVote(feedback.id, true)}
                      className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({feedback.helpful})</span>
                    </button>
                    <button
                      onClick={() => handleHelpfulVote(feedback.id, false)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Not Helpful ({feedback.notHelpful})</span>
                    </button>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Rating: {feedback.rating}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No feedback submitted yet</p>
            <p className="text-sm mt-2">Be the first to share your experience!</p>
            <p className="text-xs mt-1 text-gray-400">Submit feedback above to see it appear in community reviews</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModule;