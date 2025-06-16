import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function UserRatingPage() {
  const { userId } = useParams();
  const [userName, setUserName] = useState('');
  const [avgRate, setAvgRate] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRate, setNewRate] = useState(5);
  const [usernames, setUsernames] = useState({}); // user_id -> username map
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUserName = async () => {
    try {
      const res = await axios.get(`${API_URL}/user-name/${userId}`);
      setUserName(res.data.username);
    } catch (err) {
      console.error('Failed to fetch user name:', err);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${API_URL}/${userId}`);
      setAvgRate(res.data.avg_rate ?? null);
      setComments(res.data.comments ?? []);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setAvgRate(null);
        setComments([]);
      } else {
        console.error('Failed to fetch ratings:', err);
        setAvgRate(null);
        setComments([]);
      }
    }
  };

  // Fetch username by user_id only if not already in cache
  const fetchUsernameById = async (id) => {
    if (usernames[id]) return; // mamy już username, nie pobieraj ponownie
    try {
      const res = await axios.get(`${API_URL}/user-name/${id}`);
      setUsernames(prev => ({ ...prev, [id]: res.data.username }));
    } catch (err) {
      console.error(`Failed to fetch username for user_id=${id}`, err);
      setUsernames(prev => ({ ...prev, [id]: 'Unknown user' }));
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchRatings();
  }, [userId]);

  // Po zmianie komentarzy ładujemy username dla każdego from_user_id
  useEffect(() => {
    comments.forEach(c => {
      fetchUsernameById(c.from_user_id);
    });
  }, [comments]);

  const sendRating = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz być zalogowany, aby dodać ocenę.");
      return;
    }

    const payload = {
      user_id: parseInt(userId),
      rate: newRate,
      comment: newComment,
    };

    try {
      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Szczegóły błędu z backendu:", errorData);
        throw new Error(`Błąd wysyłania oceny: ${JSON.stringify(errorData.detail || errorData)}`);
      }

      const result = await response.json();
      console.log("Wysłano ocenę:", result);

      setNewComment('');
      setNewRate(5);
      fetchRatings();
    } catch (err) {
      console.error("Błąd podczas wysyłania oceny:", err.message);
      alert("Wystąpił błąd przy wysyłaniu oceny.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
        
        <h1 className="text-2xl font-semibold mb-2">User: {userName}</h1>
        <p className="mb-4 text-lg">Rating: {avgRate ?? 'No ratings yet'}</p>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium">Rate user (0-10)</label>
          <input
            type="number"
            min={0}
            max={10}
            value={newRate}
            onChange={(e) => setNewRate(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />

          <label className="block text-sm font-medium">Comment</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />

          <button
            onClick={sendRating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send comment
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-3">Comments and ratings:</h2>
        <div className="space-y-4">
          {comments && comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="border p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">
                  Comment by <strong>{usernames[c.from_user_id] || c.from_user_id}</strong>
                </p>
                <p className="font-medium">Rated: {c.rate}</p>
                <p>{c.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
