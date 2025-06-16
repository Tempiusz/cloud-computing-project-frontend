import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz być zalogowany, żeby wysłać prośbę.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: item.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Błąd: ${errorData.detail || "Nie udało się wysłać prośby"}`);
        return;
      }

      // Zaktualizuj lokalny stan, żeby od razu pokazać nowy status
      setItem((prev) => ({ ...prev, status: "requested" }));
    } catch (error) {
      alert("Wystąpił błąd przy wysyłaniu prośby.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/items/${id}`);
        if (!response.ok) throw new Error("Nie udało się pobrać itemu");
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <div>Ładowanie...</div>;
  if (!item) return <div>Nie znaleziono itemu</div>;

  const isDisabled = item.status !== "open" || isLoading;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="col-span-1 flex flex-col items-center">
          <img
            src={`data:image/jpeg;base64,${item.image}`}
            alt={item.name}
            className="mb-4 w-full h-80 object-cover rounded"
          />
          {item.status !== "requested" && (
            <button 
              className="mt-4 w-full bg-gray-200" 
              onClick={handleSendRequest} 
              disabled={isLoading || item.status !== "open"}
            >
              {isLoading ? "Wysyłanie..." : "Send Request for Exchange"}
            </button>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col justify-start gap-3">
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p className="text-lg">Price: <span className="font-medium">{item.price}</span></p>
          <p className="text-lg">Exchange address: <span className="font-medium">{item.address}</span></p>
          <p className="text-lg">Phone number: <span className="font-medium">{item.user.phone_number}</span></p>
          <p className="text-lg">{item.description}</p>
          <p>
            {" "}
            {item.status === "requested"
              ? "This item is already requested"
              : item.status === "open"
              ? "Open for requests"
              : item.status}
          </p>
        </div>
      </div>
    </div>
  );
}
