import React, { useState } from 'react';
import './App.css'; // Make sure you have the CSS file for styles

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

    const apiKey = 'cfe35ea7b36d6c8acc79e95017a587de';

    switch (section) {
      case 'github':
        apiUrl = `https://api.github.com/search/users?q=${query}`;
        break;
      case 'books':
        apiUrl = `https://openlibrary.org/search.json?q=${query}`;
        break;
      case 'weather':
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
            setResults(data);
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
    <div className="container">
      <h1>🌐 Info Finder App</h1>

      <div className="controls">
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="github">🐙 GitHub Users</option>
          <option value="books">📚 Books</option>
          <option value="weather">☀️ Weather</option>
        </select>
        <input
          type="text"
          placeholder="Enter search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>🔍 Search</button>
      </div>

      <div className="results">
        {loading ? <p>Loading...</p> : <DisplayResults section={section} results={results} />}
      </div>
    </div>
  );
}

function DisplayResults({ section, results }) {
  if (!results || (Array.isArray(results) && results.length === 0)) {
    return <p className="no-results">No results found.</p>;
  }

  if (section === 'github') {
    return (
      <ul className="list">
        {results.map(user => (
          <li key={user.id} className="card">
            <img src={user.avatar_url} alt="avatar" className="avatar" />
            <a href={user.html_url} target="_blank" rel="noreferrer">{user.login}</a>
          </li>
        ))}
      </ul>
    );
  }

  if (section === 'books') {
    return (
      <ul className="list">
        {results.map(book => (
          <li key={book.key} className="card">
            <strong>{book.title}</strong><br />
            <span>by {book.author_name?.[0] || 'Unknown'}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section === 'weather') {
    const w = results;
    return (
      <div className="weather-card">
        <h2>{w.name} 🌍</h2>
        <img
          src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
          alt="weather icon"
        />
        <p><strong>Temp:</strong> {w.main.temp}°C</p>
        <p><strong>Condition:</strong> {w.weather[0].description}</p>
        <p><strong>Humidity:</strong> {w.main.humidity}%</p>
        <p><strong>Wind:</strong> {w.wind.speed} m/s</p>
      </div>
    );
  }

  return null;
}

export default App;