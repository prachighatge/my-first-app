// src/App.js
import React, { useState } from 'react';
import './styles.css';

// Hardcoded API keys (replace with your actual keys)
const weatherKey = 'cfe35ea7b36d6c8acc79e95017a587de';
const newsKey = 'pub_740a79cd2612413495fe3d3533dc3d53';
const movieKey = 'd07f3b6b';

function App() {
  const [section, setSection] = useState('github');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;

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
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weatherKey}&units=metric`;
        break;
      case 'news':
        apiUrl = `https://newsdata.io/api/1/news?apikey=${newsKey}&q=${query}&language=en`;
        break;
      case 'movies':
        apiUrl = `https://www.omdbapi.com/?apikey=${movieKey}&s=${query}`;
        break;
      default:
        return;
    }

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        switch (section) {
          case 'github':
            setResults(data.items || []);
            break;
          case 'books':
            setResults(data.docs?.slice(0, 10) || []);
            break;
          case 'weather':
            if (data.cod === 200) {
              setResults([data.main]);
            } else {
              setResults([]);
            }
            break;
          case 'news':
            setResults(data.results?.slice(0, 5) || []);
            break;
          case 'movies':
            setResults(data.Search || []);
            break;
          default:
            setResults([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="app-container">
      <h1>Info Finder App</h1>

      <div className="search-controls">
        <select value={section} onChange={e => setSection(e.target.value)}>
          <option value="github">GitHub Users</option>
          <option value="books">Books</option>
          <option value="weather">Weather</option>
          <option value="news">News</option>
          <option value="movies">Movies</option>
        </select>

        <input
          type="text"
          placeholder="Enter search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
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
  if (!results || results.length === 0) return <p>🚫 No results found.</p>;

  switch (section) {
    case 'github':
      return (
        <ul className="result-list">
          {results.map(user => (
            <li key={user.id} className="result-item">
              <img src={user.avatar_url} alt="avatar" width="50" />
              <span>{user.login}</span>
            </li>
          ))}
        </ul>
      );

    case 'books':
      return (
        <ul className="result-list">
          {results.map(book => (
            <li key={book.key} className="result-item">
              📚 <strong>{book.title}</strong> by {book.author_name?.[0] || 'Unknown'}
            </li>
          ))}
        </ul>
      );

    case 'weather':
      const w = results[0];
      return (
        <div className="weather-result">
          🌡️ <strong>Temperature:</strong> {w.temp}°C<br />
          💧 <strong>Humidity:</strong> {w.humidity}%
        </div>
      );

    case 'news':
      return (
        <ul className="result-list">
          {results.map((article, idx) => (
            <li key={idx} className="result-item">
              🗞️{' '}
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      );

    case 'movies':
      return (
        <ul className="result-list">
          {results.map(movie => (
            <li key={movie.imdbID} className="result-item">
              🎬 <strong>{movie.Title}</strong> ({movie.Year})
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

export default App;