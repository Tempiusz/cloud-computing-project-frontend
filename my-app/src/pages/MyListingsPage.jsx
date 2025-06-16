import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function MyListingsPage() {
  const [listings, setListings] = useState([]);  
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Nie jesteś zalogowany");
          return;
        }

        const response = await axios.get(`${API_URL}/my-items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const items = response.data;

        // Dla każdego itemu z requested status pobierz nazwę użytkownika
        const enrichedItems = await Promise.all(items.map(async (item) => {
          if (item.status === "requested" && item.receiver_id) {
            try {
              const res = await axios.get(`${API_URL}/user-name/${item.receiver_id}`);
              return {
                ...item,
                requesting_user_name: res.data.username,
              };
            } catch (err) {
              console.error(`Nie udało się pobrać użytkownika dla ID ${item.receiver_id}`);
              return {
                ...item,
                requesting_user_name: "Nieznany",
              };
            }
          }
          return item;
        }));

        setListings(enrichedItems);
      } catch (error) {
        console.error("Błąd podczas pobierania ogłoszeń:", error);
        alert("Nie udało się pobrać ogłoszeń.");
      }
    };

    fetchListings();
  }, []);

  const handleAccept = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz być zalogowany");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/accept-request`, {
        item_id: itemId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Odśwież listę
      setListings(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, status: "closed" } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Błąd przy akceptowaniu wymiany.");
    }
  };

  const handleReject = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz być zalogowany");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/reject-request`, {
        item_id: itemId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Odśwież listę
      setListings(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, status: "open", requesting_user_id: null, requesting_user_name: null }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Błąd przy odrzucaniu wymiany.");
    }
  };

  const handleDelete = async (id) => {

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nie jesteś zalogowany");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Odśwież listę po usunięciu
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center p-8 space-y-6">
        <h1 className="ml-40 text-3xl font-bold self-start w-full max-w-6xl">Your listings</h1>
        <div className="flex flex-col space-y-6 w-full max-w-6xl">
          {listings.map((item) => (
            <div
              key={item.id}
              className="relative flex bg-[#D9D9D9] rounded-xl shadow-md overflow-hidden h-60"
            >
              {/* STATUS */}
              <div className="absolute top-2 right-4 text-sm font-semibold">
                Status: {item.status}
                {item.status === "requested" && (
                  <div className="text-xs font-normal">by: {item.requesting_user_name}</div>
                )}
              </div>

              {/* ZDJĘCIE + PRZYCISK EDIT */}
              <div className="relative h-full w-1/3">
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="mb-4 w-full h-40 object-cover rounded"
                />
                <div className="absolute bottom-2 left-2 flex space-x-2">
                  {item.status !== "closed" && (
                    <Link
                      to={`/edit/${item.id}`}
                      className="bg-white text-black px-3 py-1 rounded shadow"
                    >
                      Edit
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* INFORMACJE */}
              <div className="p-4 flex flex-col justify-between w-2/3">
                <div>
                  <h2 className="text-2xl font-bold">{item.name}</h2>
                  <p className="text-lg font-semibold">Price: {item.price}$</p>
                  <p className="text-gray-700">Address {item.address}</p>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>

                {item.status === "requested" && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleAccept(item.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyListingsPage;