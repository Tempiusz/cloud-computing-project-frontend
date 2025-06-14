import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import axios from 'axios';

function ListingsBoardPage() {
  const [listings, setListings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');  

  useEffect(() => {
    axios.get('http://localhost:8000/items/')
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

  const filteredListings = listings.filter((listing) =>
    Object.values(listing).some((value) =>
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
        <div className="border border-gray-500 w-full max-w-6xl flex justify-between">
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
              Szukaj
            </button>
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
        <h1 className="text-3xl font-bold self-start">Ogłoszenia użytkowników</h1>

        {/* GRID Z OGŁOSZENIAMI */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-4 gap-6 max-w-6xl w-full">
            {paddedListings.map((listing, index) =>
              listing ? (
                <div
                  key={index}
                  className="bg-[#D9D9D9] rounded-lg p-4 flex flex-col items-center w-full"
                >
                  <img
                    src={listing.imageUrl}
                    alt={listing.itemName}
                    className="mb-4 w-full h-40 object-cover rounded"
                  />
                  <h2 className="text-xl font-semibold">{listing.name}</h2>
                  <p className="text-gray-800">Cena: {listing.price}$</p>
                  <p className="text-gray-700">Użytkownik: {listing.user.name}</p>
                  <p className="text-gray-700">
                    {listing.address}
                  </p>
                  <p className="text-gray-700">
                    Telefon: {listing.user.phone_number}
                  </p>
                </div>
              ) : (
                <div key={index} className="invisible w-full" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingsBoardPage;
