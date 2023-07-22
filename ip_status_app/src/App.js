import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [ipData, setIpData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:4900/api/ipstatus")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setIpData(data);
        })
        .catch((error) => {
          console.log("Fetching data failed:", error); // Debug log
        });
    };

    fetchData(); // Fetch data immediately when the component is mounted

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    // Clean up function: Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      {ipData.map((item, index) => (
        <div key={index}>
          <p>
            {item.hostname} ({item.ipAddress})
          </p>
          <p className={item.ipReplay ? "online" : "offline"}>
            {item.ipReplay ? "Online" : "Offline"}
          </p>
        </div>
      ))}
      b
    </div>
  );
}

export default App;