import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import BroadcastForm from '../components/BroadcastForm';
import BroadcastList from '../components/BroadcastList';
import RequestManager from '../components/RequestManager';

jest.mock('axios');

describe('BroadcastForm Component', () => {
  it('renders all form fields', () => {
    render(<BroadcastForm />);
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Activity/i)).toBeInTheDocument();
  });

  it('shows validation error when fields are missing', async () => {
    render(<BroadcastForm />);
    fireEvent.click(screen.getByText(/Create Broadcast/i));
    expect(await screen.findByText(/All fields are required/i)).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });
    render(<BroadcastForm />);
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-10-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Central Park' } });
    fireEvent.change(screen.getByLabelText(/Activity/i), { target: { value: 'Jogging' } });
    fireEvent.click(screen.getByText(/Create Broadcast/i));
    expect(await screen.findByText(/Broadcast created successfully/i)).toBeInTheDocument();
  });

  it('handles API failure during form submission', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to create broadcast'));
    render(<BroadcastForm />);
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-10-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Central Park' } });
    fireEvent.change(screen.getByLabelText(/Activity/i), { target: { value: 'Jogging' } });
    fireEvent.click(screen.getByText(/Create Broadcast/i));
    expect(await screen.findByText(/Failed to create broadcast/i)).toBeInTheDocument();
  });
});

describe('BroadcastList Component', () => {
  it('shows loading state initially', () => {
    render(<BroadcastList />);
    expect(screen.getByText(/Loading broadcasts/i)).toBeInTheDocument();
  });

  it('renders broadcasts after fetching', async () => {
    const mockBroadcasts = [
      { id: '1', date: '2023-10-01', time: '10:00', location: 'Central Park', activity: 'Jogging' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockBroadcasts });
    render(<BroadcastList />);
    expect(await screen.findByText(/Jogging/i)).toBeInTheDocument();
    expect(screen.getByText(/Central Park/i)).toBeInTheDocument();
  });

  it('handles API failure during fetching', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch broadcasts'));
    render(<BroadcastList />);
    expect(await screen.findByText(/Failed to fetch broadcasts/i)).toBeInTheDocument();
  });

  it('handles "Join" button functionality', async () => {
    const mockBroadcasts = [
      { id: '1', date: '2023-10-01', time: '10:00', location: 'Central Park', activity: 'Jogging' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockBroadcasts });
    axios.post.mockResolvedValueOnce({ status: 201 });
    render(<BroadcastList />);
    fireEvent.click(await screen.findByText(/Join/i));
    expect(await screen.findByText(/Joined/i)).toBeInTheDocument();
  });
});

describe('RequestManager Component', () => {
  it('shows loading state initially', () => {
    render(<RequestManager />);
    expect(screen.getByText(/Loading requests/i)).toBeInTheDocument();
  });

  it('renders requests after fetching', async () => {
    const mockRequests = [
      {
        id: '1',
        broadcastId: '1',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        status: 'pending',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockRequests });
    render(<RequestManager />);
    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
  });

  it('handles "Accept" button functionality', async () => {
    const mockRequests = [
      {
        id: '1',
        broadcastId: '1',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        status: 'pending',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockRequests });
    axios.post.mockResolvedValueOnce({ status: 200 });
    render(<RequestManager />);
    fireEvent.click(await screen.findByText(/Accept/i));
    expect(await screen.findByText(/approved/i)).toBeInTheDocument();
  });

  it('handles "Reject" button functionality', async () => {
    const mockRequests = [
      {
        id: '1',
        broadcastId: '1',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        status: 'pending',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockRequests });
    axios.post.mockResolvedValueOnce({ status: 200 });
    render(<RequestManager />);
    fireEvent.click(await screen.findByText(/Reject/i));
    expect(await screen.findByText(/rejected/i)).toBeInTheDocument();
  });
});
