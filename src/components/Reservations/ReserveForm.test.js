import { render, screen, fireEvent } from "@testing-library/react";
import ReserveForm from "./ReserveForm";
import { initializeTimes, updateTimes } from "../../utils/index";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

let windowSpy;
beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe('Testing component for ReserveForm', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ReserveForm submitForm={() => {}} availableTimes={[]} dispatch={() => {}} />
      </BrowserRouter>
    )
  })

  it('Test for some static text being rendered in the ReserveForm component', () => {
    const labelElement = screen.getByText('Choose date')
    expect(labelElement).toBeInTheDocument();
  }) 

  it('verify validate the form input fields.', () => {
    const submitForm = jest.fn()
    const dispatch = jest.fn()
    const { getByTestId } = render(
      <BrowserRouter>
        <ReserveForm submitForm={submitForm} dispatch={dispatch} />
      </BrowserRouter>
    )

    const inputDate = screen.getByTestId('date-input');
    const inputGuest = screen.getByTestId('guests-input');
    const inputTime = screen.getByTestId('time-input');
    const button = screen.getAllByText('Make reservation');
    
    fireEvent.mouseDown(inputDate)
    fireEvent.change(inputDate, { target: { value: '2023-05-18' }})
    fireEvent.mouseDown(inputGuest)
    fireEvent.change(inputGuest, { target: { value: 20 }});

    expect(inputTime).toBeEnabled()
    expect(button).toBeEnabled()

    fireEvent.submit(getByTestId('form'));

    expect(submitForm).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  })

  it('verify invalidate the form input fields and display error', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <ReserveForm submitForm={() => false} dispatch={() => {}} />
      </BrowserRouter>
    )

    const warningText = 'Tables cannot be reserved for less than one person'
    const inputDate = screen.getByTestId('date-input');

    fireEvent.mouseDown(inputDate)
    fireEvent.change(inputDate, { target: { value: '2023-05-18' }})


    act(() => {
      fireEvent.submit(getByTestId('form'))
    })

    expect(screen.getByText(warningText)).toBeInTheDocument();
  })
})

describe('Testing reducer function for validate the behavior', () => {
  it('test for the initializeTimes function to validate that it returns the correct expected value', () => {
    // arrange
    windowSpy.mockImplementation(() => {
      return {
        fetchAPI() {
          return ['15:00', '16:00', '17:00'];
        }
      }
    })
  
    // action
    const result = initializeTimes()
  
    // assert
    expect(result.length).toBe(3)
  })
  
  it('updateTimes function to validate that it returns the same value that is provided in the state', () => {
    // arrange
    const expectedValue = [
      ['15:00', '16:00', '17:00']
    ];

    windowSpy.mockImplementation(() => {
      return {
        fetchAPI() {
          return expectedValue;
        }
      }
    })
    const initialState = initializeTimes()
    const action = {
      type: 'addTimes',
      payload: '22:00'
    }
  
    // action
    const nextState = updateTimes(initialState, action)
  
    // assert
    expect(nextState).toEqual(expectedValue)
  })
})  
