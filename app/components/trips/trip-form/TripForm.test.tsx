// app/components/trips/trip-form/TripForm.test.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TripForm } from './TripForm';
import { updateTripAttribute } from '../../ui/utils/updateTrip';

describe('TripForm Component', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    ) as jest.Mock;
  });

  // const updateTripAttribute = jest.fn();
  const mockSubmit = jest.fn();
  const initialData = {
    tripId: '1',
    SK: '2',
    createdBy: 'user123',
    name: '',
    description: '',
    tags: [],
    days: [],
    tripAccessResult: {
      allowed: true,
      reason: 'access',
      hasCreateAccess: true,
      hasReadAccess: true,
      hasWriteAccess: true,
      hasDeleteAccess: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with initial data', () => {
    render(<TripForm initialData={initialData} isNewRecord={true} onSubmit={mockSubmit} />);

    expect(screen.getByTestId('editable-span-tripName')).toHaveTextContent('Enter trip name');
    expect(screen.getByTestId('editable-span-tripDescription')).toHaveTextContent('Enter trip description');
  });

  it('should allow editing trip name when clicked', async () => {
    render(<TripForm initialData={initialData} isNewRecord={true} onSubmit={mockSubmit} />);

    const nameSpan = screen.getByTestId('editable-span-tripName');

    // NOTE: how to debug the DOM
    // const { container } = render(<TripForm initialData={initialData} isNewRecord={true} onSubmit={mockSubmit} />);
    // const nameSpan = screen.getByTestId('editable-span-tripName');
    // console.log('Before click:', container.innerHTML);

    fireEvent.mouseDown(nameSpan); // Use mouseDown instead of click

    const nameInput = await screen.findByTestId('editable-input-tripName');
    await userEvent.type(nameInput, 'Summer Vacation 2025');
    expect(nameInput).toHaveValue('Summer Vacation 2025');
  });

  it('handles attribute updates', async () => {
    render(<TripForm initialData={initialData} isNewRecord={false} onSubmit={mockSubmit} />);
    
    const nameSpan = screen.getByTestId('editable-span-tripTags');
    fireEvent.mouseDown(nameSpan);
    
    const input = screen.getByTestId('editable-input-tripTags');
    fireEvent.input(input, { target: { value: 'tag1 tag2' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      // FIXME
      // expect(updateTripAttribute).toHaveBeenCalled();
      // expect(updateTripAttribute).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     tripId: '1',
      //     name: 'Europe Trip',
      //     createdAt: initialData.SK,
      //     createdBy: initialData.createdBy,
      //     tags: '',
      //     attributeKey: 'tags',
      //     attributeValue: ['tag1', 'tag2'],
      //   })
      // );

      expect(screen.getByTestId('editable-span-tripTags')).toHaveTextContent('tag1 tag2');
    });
  });

  it('handles form submission with missing trip Name', async () => {
    render(<TripForm initialData={initialData} isNewRecord={true} onSubmit={mockSubmit} />);

    // Clear fields
    const nameSpan = screen.getByTestId('editable-span-tripName');
    fireEvent.mouseDown(nameSpan);
    const nameInput = screen.getByTestId('editable-input-tripName');
    fireEvent.input(nameInput, { target: { value: '' } });
    await userEvent.clear(nameInput);

    const descriptionSpan = screen.getByTestId('editable-span-tripDescription');
    fireEvent.mouseDown(descriptionSpan);
    const descInput = screen.getByTestId('editable-input-tripDescription');
    await userEvent.clear(descInput);

    fireEvent.click(screen.getByText('Create Trip'));

    await waitFor(() => {
      expect(screen.getByText('Trip name is required')).toBeInTheDocument();
      // expect(screen.getByText('Trip description is required')).toBeInTheDocument();
    });
  }
  );

  it('handles form submission with missing trip description', async () => {
    render(<TripForm initialData={initialData} isNewRecord={true} onSubmit={mockSubmit} />);

    // Clear fields
    const nameSpan = screen.getByTestId('editable-span-tripName');
    fireEvent.mouseDown(nameSpan);
    const nameInput = screen.getByTestId('editable-input-tripName');
    await userEvent.type(nameInput, 'Summer Vacation 2025');

    const descriptionSpan = screen.getByTestId('editable-span-tripDescription');
    fireEvent.mouseDown(descriptionSpan);
    const descInput = screen.getByTestId('editable-input-tripDescription');
    await userEvent.clear(descInput);

    fireEvent.click(screen.getByText('Create Trip'));

    await waitFor(() => {
      expect(screen.getByText('Trip description is required')).toBeInTheDocument();
    });
  }
  );

  it.skip('calls onSubmit with trimmed values', async () => {
    render(<TripForm initialData={initialData} isNewRecord={true} onSubmit={mockSubmit} />);

    const nameSpan = screen.getByTestId('editable-span-tripName');
    const descriptionSpan = screen.getByTestId('editable-span-tripDescription');

    fireEvent.click(nameSpan);
    await userEvent.clear(nameSpan);
    await userEvent.type(nameSpan, 'Updated Trip Name');

    fireEvent.click(descriptionSpan);
    await userEvent.clear(descriptionSpan);
    await userEvent.type(descriptionSpan, 'Updated description');

    fireEvent.click(screen.getByText('Create Trip'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Trip Name',
          description: 'Updated description',
        })
      );
    });
  });
});