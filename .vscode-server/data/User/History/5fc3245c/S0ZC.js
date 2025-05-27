import React, { useState } from 'react';

function App() {
  const [section, setSection] = useState('github');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query) return;

    setLoading(true);
    setResults([]);

    let apiUrl = '';

    switch (section) {
      case 'github':
        apiUrl = `https://api.github.com/search/users?q=${query}`;
        break;
      case 'books':
        apiUrl = `https://openlibrary.org/search.json?q=${query}`;
        break;
      case 'weather':
        const apiKey = 'YOUR_cfe35ea7b36d6c8acc79e95017a587de'; // 🔁 Replace this with your actual OpenWeatherMap key
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;
        break;
      default:
        return;
    }

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (section === 'github') {
          setResults(data.items || []);
        } else if (section === 'books') {
          setResults(data.docs?.slice(0, 10) || []);
        } else if (section === 'weather') {
          if (data.cod === 200) {
            setResults(data); // results is a single object, not array
          } else {
            setResults(null);
          }
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setResults(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Info Finder App</h1>

      <div style={{ marginBottom: '10px' }}>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="github">GitHub Users</option>
          <option value="books">Books</option>
          <option value="weather">Weather</option>
        </select>
        <input
          style={{ marginLeft: '10px' }}
          type="text"
          placeholder="Enter search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DisplayResults section={section} results={results} />
      )}
    </div>
  );
}

function DisplayResults({ section, results }) {
  if (!results || (Array.isArray(results) && results.length === 0)) {
    return <p>No results found.</p>;
  }

  if (section === 'github') {
    return (
      <ul>
        {results.map(user => (
          <li key={user.id}>
            <img src={user.avatar_url} width="50" alt="avatar" /> {user.login}
          </li>
        ))}
      </ul>
    );
  }

  if (section === 'books') {
    return (
      <ul>
        {results.map(book => (
          <li key={book.key}>
            📖 <strong>{book.title}</strong> by {book.author_name?.[0] || 'Unknown'}
          </li>
        ))}
      </ul>
    );
  }

  if (section === 'weather') {
    const w = results; // already an object
    return (
      <div>
        <p><strong>City:</strong> {w.name}</p>
        <p><strong>Temperature:</strong> {w.main.temp}°C</p>
        <p><strong>Condition:</strong> {w.weather[0].description}</p>
        <p><strong>Humidity:</strong> {w.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> {w.wind.speed} m/s</p>
      </div>
    );
  }

  return null;
}

export default App;