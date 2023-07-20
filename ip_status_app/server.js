let failFlag=true;

const express = require('express');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  
app.use(cors());

// Add middleware to parse JSON from requests
app.use(express.json());

var Ping = require('ping-wrapper');


// load configuration from file 'config-default-' + process.platform
// Only linux is supported at the moment
Ping.configure();


var ping = new Ping('777.46.0.6');

ping.on('ping', function(data){
	console.log('Ping %s: time: %d ms', data.host, data.time);
  failFlag=false;
});

ping.on('fail', function(data){
	console.log('Fail', data);
  failFlag=true;
});



app.get('/api/ipstatus/', (req, res) => {
    // simulate dynamic data
    const data = ping; // Function that dynamically generates new data
  
    res.json(failFlag);
  });

const PORT = process.env.PORT || 4900;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Debug log
