import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddListingPage({ addListing }) {
  const navigate = useNavigate(); // ← tu jest poprawne użycie hooka
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    exchangeAddress: "",
    description: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result.split(',')[1], // tylko czysty base64 bez nagłówka
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token"); // jeśli używasz tokena JWT
  if (!token) {
    alert("Nie jesteś zalogowany");
    return;
  }

  const payload = {
    name: formData.itemName,
    image: formData.photo,
    price: parseFloat(formData.price),
    address: formData.exchangeAddress,
    description: formData.description || "",
  };

  console.log("Payload:", payload);

  try {
    const response = await fetch(`${API_URL}/items/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // jeśli backend wymaga JWT
      },
      body: JSON.stringify(payload),
    });    

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Szczegóły błędu z backendu:", errorData); // ← to dodaj
      throw new Error(`Błąd dodawania ogłoszenia: ${JSON.stringify(errorData.detail || errorData)}`);
    }

    const result = await response.json();
    console.log("Dodano ogłoszenie:", result);
    navigate("/listings");
  } catch (error) {
    console.error("Błąd podczas wysyłania ogłoszenia:", error.message);
    alert("Wystąpił błąd przy dodawaniu ogłoszenia.");
  }
};

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 mt-6 bg-[#242424] rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add information about your listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Item name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, ""); // usuwa wszystko co nie cyfrą
                setFormData((prev) => ({ ...prev, price: onlyNumbers }));
              }}
              className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Exchange Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Exchange address</label>
            <input
              type="text"
              name="exchangeAddress"
              value={formData.exchangeAddress}
              onChange={handleChange}
              className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded-2xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 rounded-2xl border border-dashed border-gray-400 text-gray-700 cursor-pointer bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#D9D9D9] text-black py-2 rounded-full font-semibold hover:bg-gray-300 transition"
          >
            Add Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddListingPage;
