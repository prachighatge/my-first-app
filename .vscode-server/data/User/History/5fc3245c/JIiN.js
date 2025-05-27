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

    // 🔑 Replace this with your actual OpenWeatherMap API key
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
            setResults(data); // store the full weather object
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
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🌐 Info Finder App</h1>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <select value={section} onChange={(e) => setSection(e.target.value)} style={inputStyle}>
          <option value="github">GitHub Users</option>
          <option value="books">Books</option>
          <option value="weather">Weather</option>
        </select>
        <input
          type="text"
          placeholder="Enter search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={buttonStyle}>
          🔍 Search
        </button>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        {loading ? <p>Loading...</p> : <DisplayResults section={section} results={results} />}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 16px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

function DisplayResults({ section, results }) {
  if (!results || (Array.isArray(results) && results.length === 0)) {
    return <p style={{ textAlign: 'center' }}>No results found.</p>;
  }

  if (section === 'github') {
    return (
      <ul style={listStyle}>
        {results.map(user => (
          <li key={user.id} style={itemStyle}>
            <img src={user.avatar_url} width="50" alt="avatar" style={{ borderRadius: '50%' }} />
            <span style={{ marginLeft: '10px' }}>{user.login}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section === 'books') {
    return (
      <ul style={listStyle}>
        {results.map(book => (
          <li key={book.key} style={itemStyle}>
            📖 <strong>{book.title}</strong> by {book.author_name?.[0] || 'Unknown'}
          </li>
        ))}
      </ul>
    );
  }

  if (section === 'weather') {
    const w = results;
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>🌤 {w.name}</h2>
        <p><strong>Temperature:</strong> {w.main.temp}°C</p>
        <p><strong>Condition:</strong> {w.weather[0].description}</p>
        <p><strong>Humidity:</strong> {w.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> {w.wind.speed} m/s</p>
      </div>
    );
  }

  return null;
}

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const itemStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
};

export default App;