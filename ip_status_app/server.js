const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const Ping = require("ping-wrapper");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

Ping.configure();

// Create a database connection
let db = new sqlite3.Database("./IP.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

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

app.get("/api/ipstatus/", (req, res) => {
  db.all(`SELECT ip, hostname FROM hosts`, async (err, rows) => {
    if (err) {
      throw err;
    }

    let promises = rows.map(({ ip, hostname }) => pingHost(ip, hostname));
    let results = await Promise.all(promises);
    res.json(results);
  });
});

app.post("/api/hosts", (req, res) => {
  const { ip, hostname } = req.body;

  if (!ip || !hostname) {
    return res.status(400).json({ error: "ip and hostname are required" });
  }

  db.run(
    `INSERT INTO hosts(ip, hostname) VALUES(?, ?)`,
    [ip, hostname],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    },
  );
});

app.delete("/api/hosts/:ip", (req, res) => {
  const ip = req.params.ip;

  db.run(`DELETE FROM hosts WHERE ip = ?`, ip, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deletedRows: this.changes });
  });
});

const PORT = process.env.PORT || 4900;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Debug log