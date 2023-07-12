import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ipData, setIpData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4900/api/ipstatus')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Data fetched from server:', data); // Debug log
        setIpData(data);
      })
      .catch((error) => {
        console.log('Fetching data failed:', error); // Debug log
      });
  }, []);

  return (
    <div className="App">
      {ipData.map((item, index) => (
        <div key={index}>
          <p>{item.ip}</p>
          <p className={item.status ? 'online' : 'offline'}>
            {item.status ? 'Online' : 'Offline'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
