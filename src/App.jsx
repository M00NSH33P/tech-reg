import { useState, useEffect, useMemo } from 'react';
import LoanModal from './components/LoanModal';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory`)
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(err => console.error("Failed to fetch inventory:", err));
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleLoanSubmit = async (loanDetails) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanDetails),
      });
      if (!response.ok) {
        throw new Error('Failed to submit loan');
      }
      alert('Loan recorded successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Loan submission error:', error);
      alert('Error: Could not record loan.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tech Registry</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search number and name..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="filter-button">Filter</button>
        </div>
      </header>
      <div className="inventory-list">
        <div className="inventory-instruction">
          <small>Click an item below to fill out the sign in/out form.</small>
        </div>
        {filteredInventory.map(item => (
          <div key={item.id} className="inventory-item" onClick={() => handleSelectItem(item)}>
            <span className="item-name">{item.name}</span>
          </div>
        ))}
      </div>
      {selectedItem && <LoanModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
        onSubmit={handleLoanSubmit}
      />}
    </div>
  );
}

export default App;

