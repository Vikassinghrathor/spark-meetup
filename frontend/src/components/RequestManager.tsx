'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Request {
  id: string;
  broadcastId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}

export default function RequestManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/requests');
        setRequests(response.data);
      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    setActionStatus((prev) => ({ ...prev, [requestId]: 'loading' }));

    try {
      const response = await axios.post(`/api/requests/${requestId}/${action}`);
      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: action === 'accept' ? 'approved' : 'rejected' } : req
          )
        );
        setActionStatus((prev) => ({ ...prev, [requestId]: 'success' }));
      }
    } catch (err) {
      setActionStatus((prev) => ({ ...prev, [requestId]: 'error' }));
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading requests...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No join requests available at the moment.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-bold">{request.user.name}</p>
              <p className="text-sm text-gray-600">{request.user.email}</p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium capitalize">{request.status}</span>
              </p>
            </div>
            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction(request.id, 'accept')}
                  disabled={actionStatus[request.id] === 'loading'}
                  className={`py-2 px-4 rounded-md text-white text-sm font-medium ${
                    actionStatus[request.id] === 'loading'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {actionStatus[request.id] === 'loading' ? 'Processing...' : 'Accept'}
                </button>
                <button
                  onClick={() => handleAction(request.id, 'reject')}
                  disabled={actionStatus[request.id] === 'loading'}
                  className={`py-2 px-4 rounded-md text-white text-sm font-medium ${
                    actionStatus[request.id] === 'loading'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionStatus[request.id] === 'loading' ? 'Processing...' : 'Reject'}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
