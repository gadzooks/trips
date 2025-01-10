import React from 'react'
import '@testing-library/jest-dom';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripDetails from './TripDetails';

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

global.fetch = jest.fn();

const mockTrip = {
  id: '123',
  title: 'Summer Vacation',
  description: 'A wonderful trip',
  isPublic: false,
  rows: [{
    id: 'row1',
    date: '2024-07-01',
    location: 'Paris',
    activity: 'Eiffel Tower',
    driveTime: '2 hours',
    notes: 'Remember camera'
  }]
};

describe('TripDetails', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrip)
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays trip data', async () => {
    render(<TripDetails tripId="123" />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Summer Vacation')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Private')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({ ok: false })
    );

    render(<TripDetails tripId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  test('updates trip visibility', async () => {
    const user = userEvent.setup();
    render(<TripDetails tripId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Private')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Private'));

    expect(fetch).toHaveBeenCalledWith('/api/trips/123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: true }),
    });
  });

  test('handles empty itinerary', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockTrip, rows: [] })
      })
    );

    render(<TripDetails tripId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/no itinerary items/i)).toBeInTheDocument();
    });
  });
});