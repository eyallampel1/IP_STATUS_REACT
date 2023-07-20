import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
let myObj={};


  const [ipData, setIpData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4900/api/ipstatus')
      .then((res) => {
        console.log("connected!!!"); // Debug log
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Data fetched from server:', data); // Debug log
        if (data.status === false){
          myObj.status = true;
        }
        else{
          myObj.status = false;
        }

        setIpData(myObj);
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
