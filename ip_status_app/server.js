const express = require("express");
const cors = require("cors");
const Ping = require("ping-wrapper");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

Ping.configure();

const hosts = {
  "7.0.0.1": "Host1",
  "127.0.0.1": "Host2",
  "9.0.0.1": "Host3",
  // Add more hosts here
};

const pingHost = (ip, hostname) => {
  return new Promise((resolve, reject) => {
    let ping = new Ping(ip);

    ping.on("ping", (data) => {
      resolve({ ipAddress: ip, hostname: hostname, ipReplay: true });
    });

    ping.on("fail", (data) => {
      resolve({ ipAddress: ip, hostname: hostname, ipReplay: false });
    });
  });
};

app.get("/api/ipstatus/", async (req, res) => {
  let promises = Object.entries(hosts).map(([ip, hostname]) =>
    pingHost(ip, hostname),
  );
  let results = await Promise.all(promises);
  res.json(results);
});

const PORT = process.env.PORT || 4900;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Debug log