import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import axios from 'axios';

function ListingsBoardPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [listings, setListings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');  
  const [viewOnlyOpen, setViewOnlyOpen] = useState(false); // nowy stan

  useEffect(() => {
    axios.get(`${API_URL}/items/`)
      .then(response => {
        setListings(response.data);
      })
      .catch(error => {
        console.error('Błąd podczas pobierania ogłoszeń:', error);
      });
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  // Najpierw filtruj wg searchTerm i statusu open jeśli viewOnlyOpen włączone
  const filteredListings = listings
    .filter(listing => listing && listing.status !== "closed") // zawsze pomijamy closed
    .filter(listing => !viewOnlyOpen || listing.status === "open") // jeśli toggle włączony, tylko open
    .filter(listing =>
      Object.values(listing).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const paddedListings = [
    ...filteredListings,
    ...Array((4 - (filteredListings.length % 4)) % 4).fill(null),
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-start p-8 space-y-6">
        
        {/* PANEL PRZYCISKÓW */}
        <div className="w-full max-w-6xl flex justify-between">
          {/* LEWA STRONA */}
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-[#D9D9D9] text-black px-4 py-2 rounded-full outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[#D9D9D9] text-black px-4 py-2 rounded-full"
            >
              Enter search phrase
            </button>
            {/* Toggle button */}
            <label className="inline-flex items-center space-x-2 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={viewOnlyOpen}
                onChange={() => setViewOnlyOpen(!viewOnlyOpen)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-black">View only open for requests</span>
            </label>
          </div>

          {/* PRAWA STRONA */}
          <div className="flex flex-col space-y-4 items-end">
            <Link
              to="/add"
              className="bg-[#D9D9D9] text-black px-4 py-2 rounded-full text-center w-fit"
            >
              Add listing
            </Link>
            <Link
              to="/mylistings"
              className="bg-[#D9D9D9] text-black px-4 py-2 rounded-full text-center w-fit"
            >
              Your listings
            </Link>
          </div>
        </div>

        {/* TYTUŁ */}
        <h1 className="ml-40 text-3xl font-bold self-start">Listings</h1>

        {/* GRID Z OGŁOSZENIAMI */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-4 gap-6 max-w-6xl w-full">
            {paddedListings.map((listing, index) =>
              listing ? (
                <Link to={`/item/${listing.id}`} className="w-full" key={index}>
                  <div className="bg-[#D9D9D9] rounded-lg p-4 flex flex-col items-center w-full">
                    <img
                      src={`data:image/jpeg;base64,${listing.image}`}
                      alt={listing.name}
                      className="mb-4 w-full h-40 object-cover rounded"
                    />
                    <h2 className="text-xl font-semibold">{listing.name}</h2>
                    <p className="text-gray-800">Price: {listing.price}$</p>
                    <p className="text-gray-700">User: {listing.user.name}</p>
                    <p className="text-gray-700">{listing.address}</p>
                    <p className="text-gray-700">User phone number: {listing.user.phone_number}</p>
                    <p className="text-gray-700">
                      {listing.status === "requested"
                        ? "This item is already requested"
                        : listing.status === "open"
                        ? "Open for requests"
                        : listing.status}
                    </p>
                  </div>
                </Link>
              ) : (
                <div key={index} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingsBoardPage;
