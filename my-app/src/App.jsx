import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");

  const handleButtonClick = async () => {
    const response = await fetch('http://localhost:8000/dziala');
    const data = await response.json();
    if (data.status === "OK") {
      setMessage("Request was successful!");
    } else {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="App">
      <h1>FastAPI + React Example</h1>
      <button onClick={handleButtonClick}>Kliknij, aby sprawdzić!</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
