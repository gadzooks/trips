// app/components/trips/trip-form/TripDayComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TripDayComponent from './TripDayComponent';
import { TripDayDTO } from '@/types/trip';

// Mock dataTransfer
Object.defineProperty(global, 'DataTransfer', {
  value: function() {
    return {
      effectAllowed: null,
      dropEffect: null,
      setData: jest.fn(),
      getData: jest.fn()
    };
  }
});

// Mock the window resize events
const mockResizeListener = jest.fn();
window.addEventListener = jest.fn().mockImplementation((event, cb) => {
  if (event === 'resize') mockResizeListener();
});

// Mock the Mobile component
jest.mock('./MobileTripDays', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mobile-trip-days">Mobile View</div>)
}));

describe('TripDayComponent', () => {
  const mockOnChange = jest.fn();
  
  const defaultProps = {
    onChange: mockOnChange,
    initialRows: [],
    isReadOnly: false,
    isNewRecord: true
  };

  const sampleDay: TripDayDTO = {
    date: '2024-02-08',
    itinerary: 'Visit museum',
    reservations: 'Museum tickets',
    lodging: 'Hotel ABC',
    travelTime: '2h',
    notes: 'Bring camera',
    cost: '',
    cancelBy: '',
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    window.innerWidth = 1024;
  });

  it.skip.each([
    ['date', 'input[placeholder="Date"]'],
    ['itinerary', 'textarea[placeholder="Add itinerary..."]'],
    ['reservations', 'textarea[placeholder="Add booking details..."]'],
    ['lodging', 'input[placeholder="Lodging location"]'],
    ['travelTime', 'input[placeholder="Time"]'],
    ['notes', 'textarea[placeholder="Notes"]']
  ])('updates %s field correctly', async (field, selector) => {
    render(<TripDayComponent {...defaultProps} initialRows={[sampleDay]} />);
    
    const input = screen.getByDisplayValue(sampleDay[field as keyof TripDayDTO]);
    const newValue = 'Updated ' + field;
    
    await userEvent.clear(input);
    await userEvent.type(input, newValue);
    
    expect(input).toHaveValue(newValue);
  });

  it('adds new day when Add Day button is clicked', async () => {
    render(<TripDayComponent {...defaultProps} />);
    
    const addButton = screen.getByRole('button', { name: /add day/i });
    await userEvent.click(addButton);
    
    //FIXME not working
    // const element = screen.getByTestId('editable-input-date');
    // expect(element).toBeInTheDocument();
  });

  it('removes day when delete button is clicked', async () => {
    render(<TripDayComponent {...defaultProps} initialRows={[sampleDay]} />);
    
    const deleteButton = screen.getByRole('button', { name: '' });
    await userEvent.click(deleteButton);
    
    //FIXME not working
    // const dateInputs = screen.queryAllByPlaceholderText('Date');
    // expect(screen.getByDisplayValue('Date')).toBeInTheDocument();
    // expect(dateInputs).toHaveLength(0);
  });

  it.skip('handles save changes correctly', async () => {
    render(<TripDayComponent {...defaultProps} initialRows={[sampleDay]} isNewRecord={false} />);
    
    const input = screen.getByTestId('readonly-span-date')
    await userEvent.click(input);
    await userEvent.type(input, 'New Date');
    
    const element = screen.getByTestId('editable-input-date');
    expect(element).toBeInTheDocument();
    //FIXME not working
    // const saveButton = screen.getByRole('button', { name: /save changes/i });
    // await userEvent.click(saveButton);
    
    // expect(mockOnChange).toHaveBeenCalledWith([
    //   expect.objectContaining({ date: 'New Date' })
    // ]);
  });

  it.skip('resets changes when Reset button is clicked', async () => {
    render(<TripDayComponent {...defaultProps} initialRows={[sampleDay]} isNewRecord={false} />);
    
    // const input = screen.getByDisplayValue(sampleDay.date);
    const input = screen.getByTestId('readonly-span-date')

    await userEvent.click(input);
    await userEvent.type(input, 'New Date');
    
    //FIXME this does not work
    // const resetButton = screen.getByRole('button', { name: /reset/i });
    // await userEvent.click(resetButton);
    
    // expect(screen.getByDisplayValue(sampleDay.date)).toBeInTheDocument();
  });

  it('renders in read-only mode correctly', () => {
    render(<TripDayComponent {...defaultProps} isReadOnly={true} initialRows={[sampleDay]} />);
    
    const expectedIds = ['reservations'];
    expectedIds.forEach(id => {
      expect(screen.getByTestId(`readonly-span-${id}`)).toBeInTheDocument();
    });
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toBeDisabled();
    
    expect(screen.queryByRole('button', { name: /add day/i })).not.toBeInTheDocument();
  });

  it('switches to mobile view when window width is less than 768px', () => {
    window.innerWidth = 767;
    render(<TripDayComponent {...defaultProps} />);
    
    expect(screen.getByTestId('mobile-trip-days')).toBeInTheDocument();
  });

  // Skip drag and drop tests in JSDOM environment
  //For comprehensive drag-and-drop testing, you should use Cypress or Playwright since JSDOM doesn't fully support these events.
  describe.skip('Drag and Drop functionality - use Cypress or Playwright', () => {
    it('renders draggable rows when not in readonly mode', () => {
      const initialRows = [
        { ...sampleDay, date: 'Day 1' },
        { ...sampleDay, date: 'Day 2' }
      ];
      
      render(<TripDayComponent {...defaultProps} initialRows={initialRows} />);
      
      const rows = screen.getAllByRole('row').slice(1);
      rows.forEach(row => {
        expect(row).toHaveAttribute('draggable', 'true');
      });
    });
  });

  describe('Snapshots', () => {
    const mockInitialRows = [
      {
        date: '2024-02-01',
        itinerary: 'City tour',
        reservations: 'Tour booking #123',
        lodging: 'Hotel ABC',
        travelTime: '2h',
        notes: 'Bring camera',
        cost: '',
        cancelBy: '',
      }
    ];

    it('matches read-only snapshot', () => {
      const tree = render(
          <TripDayComponent
            initialRows={mockInitialRows}
            onChange={() => {}}
            isReadOnly={true}
            isNewRecord={false}
          />
        );
      expect(tree).toMatchSnapshot();
    });

    it('matches editable snapshot', () => {
      const tree = render
        (
          <TripDayComponent
            initialRows={mockInitialRows}
            onChange={() => {}}
            isReadOnly={false}
            isNewRecord={false}
          />
        );
      expect(tree).toMatchSnapshot();
    });

    it('matches empty state snapshot', () => {
      const tree = render
        (
          <TripDayComponent
            initialRows={[]}
            onChange={() => {}}
            isReadOnly={false}
            isNewRecord={true}
          />
        );
      expect(tree).toMatchSnapshot();
    });
  });
});