'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Broadcast {
  id: string;
  date: string;
  time: string;
  location: string;
  activity: string;
}

export default function BroadcastList() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinStatus, setJoinStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await axios.get('/api/broadcasts');
        setBroadcasts(response.data);
      } catch (err) {
        setError('Failed to fetch broadcasts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBroadcasts();
  }, []);

  const handleJoin = async (broadcastId: string) => {
    setJoinStatus((prev) => ({ ...prev, [broadcastId]: 'loading' }));

    try {
      const response = await axios.post(`/api/requests`, { broadcastId });
      if (response.status === 201) {
        setJoinStatus((prev) => ({ ...prev, [broadcastId]: 'success' }));
      }
    } catch (err) {
      setJoinStatus((prev) => ({ ...prev, [broadcastId]: 'error' }));
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading broadcasts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {broadcasts.length === 0 ? (
        <p className="text-center text-gray-500">No broadcasts available at the moment.</p>
      ) : (
        broadcasts.map((broadcast) => (
          <div
            key={broadcast.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-bold">{broadcast.activity}</p>
              <p className="text-sm text-gray-600">
                {broadcast.date} at {broadcast.time}
              </p>
              <p className="text-sm text-gray-600">{broadcast.location}</p>
            </div>
            <button
              onClick={() => handleJoin(broadcast.id)}
              disabled={joinStatus[broadcast.id] === 'loading'}
              className={`py-2 px-4 rounded-md text-white text-sm font-medium ${
                joinStatus[broadcast.id] === 'success'
                  ? 'bg-green-500 cursor-not-allowed'
                  : joinStatus[broadcast.id] === 'error'
                  ? 'bg-red-500'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {joinStatus[broadcast.id] === 'loading'
                ? 'Joining...'
                : joinStatus[broadcast.id] === 'success'
                ? 'Joined'
                : joinStatus[broadcast.id] === 'error'
                ? 'Retry'
                : 'Join'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
