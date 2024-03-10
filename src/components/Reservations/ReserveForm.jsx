import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestsErrorMessage = () => {
  return (
    <p className="field-error">
      Tables cannot be reserved for less than one person
    </p>
  );
};

function ReserveForm({ submitForm, availableTimes = [], dispatch }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState({ value: '0' });
  const [occasion, setOccasion] = useState('birthday');
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const navigate = useNavigate()

  const getIsFormValid = () => date && guests && time;
  const clearForm = () => {
    setTime('')
    setDate('')
    setGuests({ value: '' })
    setOccasion('')
    setWasSubmitted(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setWasSubmitted('/')

    if (guests.value < 1) return

    const formData = {
      time,
      date,
      guests: guests.value,
      occasion,
    }

    if (formData) {
      submitForm(formData)
      navigate('/reservation/confirmation')
      clearForm()
    }
  };

  return (
    <form
      className="box"
      onSubmit={handleSubmit}
      data-testid="form"
      aria-label="reseave a table"
    >
      <label htmlFor="date">
        Choose date<sup>*</sup>
      </label>
      <input
        type="date"
        id="date"
        data-testid="date-table"
        value={date}
        onChange={(e) => {
          setDate(e.target.value)
          dispatch({ type: 'addTimes', payload: date })
        }}
        aria-label="Choose a date"
        autoFocus
        aria-required="true"
      />
      <label htmlFor="time">
        Select time<sup>*</sup>
      </label>
      <select
        id="time"
        data-testid="time-input"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        disabled={!date}
        aria-label="Select a time"
        aria-required="true"
      >
        {availableTimes.map((available) => (
          <option key={available} value={available}>{available}</option>
        ))}
      </select>

      <label htmlFor="guests">
        Number of guests<sup>*</sup>
      </label>
      <input
        type="number"
        placeholder={0}
        id="guests"
        data-testid="guests-input"
        value={guests.value}
        onChange={(e) => setGuests({ value: e.target.value })}
        aria-label="Number of guests"
        aria-required="true"
      />

      {wasSubmitted && Number(guests.value) < 1 ? <GuestsErrorMessage /> : null}

      <label htmlFor="occasion">Select occasion</label>
      <select
        id="occasion"
        name="occasion"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
        aria-label="Make a Occasion"
      >
        <option value="Birthday">Birthday</option>
        <option value="Anniversary">Anniversary</option>
      </select>

      <button type="submit" className="btn-form" disabled={!getIsFormValid()}>
        Make reservation
      </button>
    </form>
  );
}

export default ReserveForm;