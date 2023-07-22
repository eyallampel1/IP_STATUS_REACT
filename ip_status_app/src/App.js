import React, { useEffect, useState } from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import "./App.css";

function App() {
  const [ipData, setIpData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
        })
        .catch((error) => {
          console.log("Fetching data failed:", error);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <LinearProgress /> // Show LinearProgress when loading
      ) : (
        ipData.map((item, index) => (
          <div key={index}>
            <p>
              {item.hostname} ({item.ipAddress})
            </p>
            <p className={item.ipReplay ? "online" : "offline"}>
              {item.ipReplay ? "Online" : "Offline"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;