import React, { useState, useEffect } from 'react';

const LoanModal = ({ item, isOpen, onClose, onSubmit }) => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [status, setStatus] = useState('Signed Out'); // Default status

  useEffect(() => {
    if (isOpen) {
      // Fetch people when modal opens
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/people`)
        .then(res => res.json())
        .then(data => {
          setPeople(data);
          if (data.length > 0) {
            setSelectedPerson(data[0].id);
          }
        })
        .catch(err => console.error("Failed to fetch people", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
  e.preventDefault();
  // Set signOut/signIn based on status
  const signOut = status === 'Signed Out';
  const signIn = status === 'Signed In';
  // Use today's date in YYYY-MM-DD format
  const date = new Date().toISOString().split('T')[0];
  onSubmit({
    itemId: item.id,
    personId: selectedPerson,
    signOut,
    signIn,
    date,
  });
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>×</button>
        {/* Instruction */}
        <div style={{marginBottom: '10px'}}>
          <small>Please fill out the form to sign this item in or out.</small>
        </div>
        <h2> <b>Sign out Item:</b> {item.name}</h2>
        <p><b>Tech No:</b> {item.techNo}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group modern-select-group">
            <label htmlFor="person"><b>Name:</b></label>
            <div className="modern-select-wrapper">
              <select
                id="person"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                required
                className="modern-select"
              >
                {people.map(person => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
              <span className="modern-select-arrow">&#9662;</span>
            </div>
          </div>
          <div className="form-group">
            <label><b>Status:</b></label>
            <div className="radio-row">
              <div>
                <input
                  type="radio"
                  id="out"
                  name="status"
                  value="Signed Out"
                  checked={status === 'Signed Out'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="large-radio"
                />
                <label htmlFor="out" className="large-radio-label">Sign Out</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="in"
                  name="status"
                  value="Signed In"
                  checked={status === 'Signed In'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="large-radio"
                />
                <label htmlFor="in" className="large-radio-label">Sign In</label>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanModal;
