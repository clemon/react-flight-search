'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let express = require('express');
let app = express();
let request = require('request');
let server = require('http').createServer(app);
let keys = require('./environment/apikeys.js');   // flightstats API keys

let config = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080
};

app.set('view engine', 'html');


if (app.get('env') === 'development') {
	console.log('dev');
	app.use(express.static(__dirname + '/.dist'));
} else {
	app.use(express.static(__dirname + '/dist'));
}

//        /flightStats/<carrier>/<flight>
// call to the flightstats flight status API endpoint
app.get('/flightStats/:carrier/:flight', (req, res) => {
  let now = new Date();
  let url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/`+
            `${req.params.carrier}/${req.params.flight}`+
            `/arr/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`+
            `?appId=${keys.fsAppId}&appKey=${keys.fsKey}&utc=true`+
            `&numHours=24&includeFlightPlan=false&maxPositions=2`;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {       // if success

      let jsonRes = JSON.parse(body).flightTracks;
      let track = jsonRes[jsonRes.length-1];        // take the latest flightTrack in the list

      if (!track) {                                  // flight found but not track
        res.status(404).send("flight not found");
        return;
      }

      let delaymins = 0;                            // init delay to 0
      if ('delayMinutes' in track)                  // if response doesnt have delayMinutes
        delaymins = track.delayMinutes;             // it is considered on time

      res.json({dep: track.departureAirportFsCode,  // send data as json back to the client
                arr: track.arrivalAirportFsCode,    // Dashboard.handleSearch
                delay: delaymins});
    }
    else if (error && response.statusCode == 400) {   // if malformed input
      res.status(400).send("invalid input");
    }
    else if (error && response.statusCode == 404) {   // if not found
      res.status(404).send("flight not found");
    }

  });
});

// Start server
server.listen(config.port, config.ip, () => {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
