import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function EditListingPage({ getListingById, updateListing, removeListing }) {
  const navigate = useNavigate();
  const { listingId } = useParams();

  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    exchangeAddress: "",
    description: "",
    photo: null,
  });

  const [originalPhoto, setOriginalPhoto] = useState(null); // ← żeby nie nadpisywać zdjęcia przy edycji

  // Ładujemy dane ogłoszenia do formularza
  useEffect(() => {
    const loadListing = async () => {
      const data = await getListingById(listingId);
      if (data) {
        setFormData({
          itemName: data.itemName,
          price: data.price,
          exchangeAddress: data.exchangeAddress,
          description: data.description,
          photo: null,
        });
        setOriginalPhoto(data.photo);
      }
    };

    loadListing();
  }, [listingId, getListingById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedListing = {
      itemName: formData.itemName,
      price: formData.price,
      exchangeAddress: formData.exchangeAddress,
      description: formData.description,
      photo: formData.photo
        ? URL.createObjectURL(formData.photo)
        : originalPhoto,
    };

    await updateListing(listingId, updatedListing);
    navigate("/listings");
  };

  const handleRemove = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await removeListing(listingId);
      navigate("/listings");
    }
  };

  return (    
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 mt-6 bg-[#242424] rounded-2xl shadow-md">      
        <h1 className="text-2xl font-bold mb-6 text-center">
          Edit your listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pozostałe pola bez zmian... */}
          <div>
            <label className="block text-sm font-medium mb-1">Item name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full p-2 rounded-full border border-gray-300"
            />
          </div>
          {/* ... inne pola: price, address, description itd. */}

          {/* Zdjęcie */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            {originalPhoto && !formData.photo && (
              <img src={originalPhoto} alt="Current" className="w-32 h-32 mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border-dashed border rounded-2xl"
            />
          </div>

          {/* Przycisk UPDATE */}
          <button
            type="submit"
            className="w-full bg-[#D9D9D9] text-black py-2 rounded-full font-semibold hover:bg-gray-300 transition"
          >
            Update Listing
          </button>

          {/* Przycisk REMOVE */}
          <button
            type="button"
            onClick={handleRemove}
            className="w-full bg-red-500 text-white py-2 rounded-full font-semibold hover:bg-red-600 transition mt-2"
          >
            Remove Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditListingPage;
