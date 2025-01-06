import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/dom';
import TripDetails from './TripDetails';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('TripDetails', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch.mockReset();
  });

  it('renders trip details', async () => {
    // Setup mock for this specific test
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          name: 'Test Trip',
          description: 'Test Description',
          isPublic: true,
          rows: [{ day: 1, activity: 'Test Activity' }],
        }),
      })
    );

    await act(async () => {
      render(<TripDetails tripId={''} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Trip')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    // Setup mock that never resolves for loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));
    
    await act(async () => {
      render(<TripDetails tripId={''} />);
    });
    
    expect(screen.getByText('Loading trip details...')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    // Setup mock for error case
    mockFetch.mockImplementation(() =>
      Promise.reject(new Error('Failed to fetch trip'))
    );

    await act(async () => {
      render(<TripDetails tripId={''} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch trip')).toBeInTheDocument();
    });
  });
});