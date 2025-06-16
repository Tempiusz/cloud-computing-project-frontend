import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    exchangeAddress: "",
    description: "",
    photo: null,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/items/${id}`);
        if (!response.ok) throw new Error("Nie udało się pobrać ogłoszenia");

        const data = await response.json();
        setFormData({
          itemName: data.name,
          price: data.price,
          exchangeAddress: data.address,
          description: data.description,
          photo: data.image, // zakładamy, że użytkownik może podmienić obraz
        });
      } catch (error) {
        console.error("Błąd podczas ładowania ogłoszenia:", error.message);
      }
    };

    fetchItem();
  }, [id]);

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
        photo: reader.result.split(",")[1],
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nie jesteś zalogowany");
      return;
    }

    const payload = {
      name: formData.itemName,
      price: parseFloat(formData.price),
      address: formData.exchangeAddress,
      description: formData.description,
    };

    if (formData.photo) {
      payload.image = formData.photo;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Szczegóły błędu z backendu:", errorData);
        throw new Error(`Błąd edycji ogłoszenia: ${JSON.stringify(errorData.detail || errorData)}`);
      }

      const result = await response.json();
      console.log("Zaktualizowano ogłoszenie:", result);
      navigate("/mylistings");
    } catch (error) {
      console.error("Błąd podczas edycji ogłoszenia:", error.message);
      alert("Wystąpił błąd przy edycji ogłoszenia.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 mt-6 bg-[#242424] rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit your listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium mb-1">Change photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 rounded-2xl border border-dashed border-gray-400 text-gray-700 cursor-pointer bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D9D9D9] text-black py-2 rounded-full font-semibold hover:bg-gray-300 transition"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditListingPage;
