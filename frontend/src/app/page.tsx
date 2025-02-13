'use client';

import BroadcastForm from '../components/BroadcastForm';
import BroadcastList from '../components/BroadcastList';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Broadcast Creation Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create a Broadcast</h2>
        <BroadcastForm />
      </section>

      {/* Broadcast List Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Available Broadcasts</h2>
        <BroadcastList />
      </section>
    </div>
  );
}
