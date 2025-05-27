import React, { useState, useEffect } from 'react';

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
        apiUrl = `https://wttr.in/${query}?format=j1`; // No API key needed
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
    setResults(null); // fallback on failure
  })
  .finally(() => {
    setLoading(false); // always stop loading
  });


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

      {loading ? <p>Loading...</p> : <DisplayResults section={section} results={results} />}
    </div>
  );
}

function DisplayResults({ section, results }) {
  if (results.length === 0) return <p>No results found.</p>;

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
    const w = results[0];
    return (
      <div>
        <p><strong>Temperature:</strong> {w.temp_C}°C</p>
        <p><strong>Condition:</strong> {w.weatherDesc[0].value}</p>
        <p><strong>Humidity:</strong> {w.humidity}%</p>
      </div>
    );
  }

  return null;
}

export default App;