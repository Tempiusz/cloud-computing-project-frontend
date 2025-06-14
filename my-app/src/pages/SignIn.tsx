import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode }  from "jwt-decode";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Niepoprawny email lub hasło.");
      }

      const data = await res.json();
      const token = data.access_token;

      // Zapis tokena do localStorage
      localStorage.setItem("token", token);

      // Dekoduj token i pokaż info
      const decoded: any = jwtDecode(token);
      const userId = decoded.sub;

      setMessage(`Zalogowano jako: ID ${userId}`);
      
      // Przekieruj na /listings po chwili
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    } catch (error: any) {
      setMessage(error.message || "Wystąpił błąd.");
    }

    

    console.log("Logging in:", formData);
    // can add validation or backend API call here later
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign in to ClothCloud
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email*
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password*
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded shadow hover:bg-blue-700 transition duration-200"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up →
          </Link>
        </p>

        <div className="flex items-center gap-2 justify-center mt-6">
          <Link to="/">
            <img
              src="/logo.png"
              alt="ClothCloud"
              className="h-9 w-auto max-w-[120px] hover:opacity-80 transition"
            />
          </Link>
        </div>
      </form>
    </div>
  );
}
