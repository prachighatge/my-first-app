import React, { useState } from 'react';

// ✅ Load your API keys from .env file
const weatherKey = process.env.REACT_APP_WEATHER_API_KEY;
const newsKey = process.env.REACT_APP_NEWS_API_KEY;
const movieKey = process.env.REACT_APP_OMDB_API_KEY;

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
      case 'weather':cfe35ea7b36d6c8acc79e95017a587de
        
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weatherKey}&units=metric`;
        break;
      case 'news':pub_740a79cd2612413495fe3d3533dc3d53
        
        apiUrl = `https://newsdata.io/api/1/news?apikey=${newsKey}&q=${query}&language=en`;
        break;
      case 'movies':570fa22e
    
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
              setResults([data.main]); // Weather data is nested under 'main'
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🌐 Info Finder App</h1>

      <div style={{ marginBottom: '10px' }}>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="github">GitHub Users</option>
          <option value="books">Books</option>
          <option value="weather">Weather</option>
          <option value="news">News</option>
          <option value="movies">Movies</option>
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

      {loading ? <p>🔄 Loading...</p> : <DisplayResults section={section} results={results} />}
    </div>
  );
}

function DisplayResults({ section, results }) {
  if (!results || results.length === 0) return <p>🚫 No results found.</p>;

  switch (section) {
    case 'github':
      return (
        <ul>
          {results.map(user => (
            <li key={user.id}>
              <img src={user.avatar_url} width="50" alt="avatar" /> {user.login}
            </li>
          ))}
        </ul>
      );
    case 'books':
      return (
        <ul>
          {results.map(book => (
            <li key={book.key}>
              📚 <strong>{book.title}</strong> by {book.author_name?.[0] || 'Unknown'}
            </li>
          ))}
        </ul>
      );
    case 'weather':
      const w = results[0];
      return (
        <div>
          🌡️ <strong>Temperature:</strong> {w.temp}°C<br />
          💧 <strong>Humidity:</strong> {w.humidity}%
        </div>
      );
    case 'news':
      return (
        <ul>
          {results.map((article, index) => (
            <li key={index}>
              🗞️ <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
            </li>
          ))}
        </ul>
      );
    case 'movies':
      return (
        <ul>
          {results.map(movie => (
            <li key={movie.imdbID}>
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