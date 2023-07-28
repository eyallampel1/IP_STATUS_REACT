import React, { useEffect, useState } from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import "./App.css";

function App() {
  const [ipData, setIpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newHostname, setNewHostname] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4900/api/ipstatus");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setIpData(data);
      setLoading(false);
    } catch (error) {
      console.log("Fetching data failed:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const addHost = () => {
    setBtnLoading(true);
    const host = { ip: newIp, hostname: newHostname };

    fetch("http://localhost:4900/api/hosts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(host),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewIp("");
        setNewHostname("");
        setBtnLoading(false);
        console.log(data);
        fetchData();
      })
      .catch((error) => {
        setBtnLoading(false);
        console.error("Error:", error);
      });
  };

  const deleteHost = (ip) => {
    setBtnLoading(true);
    fetch(`http://localhost:4900/api/hosts/${ip}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setBtnLoading(false);
        console.log(data);
        fetchData();
      })
      .catch((error) => {
        setBtnLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <div className="App">
      {loading || btnLoading ? (
        <LinearProgress /> // Show LinearProgress when loading or button operation in progress
      ) : (
        ipData.map((item, index) => (
          <div key={index}>
            <p>
              {item.hostname} ({item.ipAddress}){" "}
              <button onClick={() => deleteHost(item.ipAddress)}>Delete</button>
            </p>
            <p className={item.ipReplay ? "online" : "offline"}>
              {item.ipReplay ? "Online" : "Offline"}
            </p>
          </div>
        ))
      )}
      <div>
        <h2>Add New Host</h2>
        <label>
          IP: <input value={newIp} onChange={(e) => setNewIp(e.target.value)} />
        </label>
        <label>
          Hostname:{" "}
          <input
            value={newHostname}
            onChange={(e) => setNewHostname(e.target.value)}
          />
        </label>
        <button onClick={addHost}>Add</button>
      </div>
    </div>
  );
}

export default App;