require("dotenv").config();

const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();

const vehiclesUrl =
  "https://api.mercedes-benz.com/experimental/connectedvehicle/v1/vehicles";

app.use(express.static(__dirname + "/public"));
app.use(cors());

app.get("/oauth/redirect", (req, res) => {
  const requestToken = req.query.code;

  const options = {
    method: "POST",
    url: "https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: requestToken,
      redirect_uri: "http://localhost:8080/oauth/redirect"
    },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    const accessToken = body.access_token;
    res.redirect(`/vehicles.html?access_token=${accessToken}`);
  });
});

app.get("/vehicles", (req, res) => {
  const accessToken = req.query.access_token;

  const options = {
    method: "GET",
    url: vehiclesUrl,
    headers: {
      authorization: "Bearer " + accessToken,
      "content-type": "application/json"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });
});

app.get("/vehicles/:vehicleId", (req, res) => {
  const vehicleId = req.params.vehicleId;
  const accessToken = req.query.access_token;

  const options = {
    method: "GET",
    url: vehiclesUrl + "/" + vehicleId,
    headers: {
      authorization: "Bearer " + accessToken,
      "content-type": "application/json"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });
});

app.get("/vehicles/:vehicleId/doors", (req, res) => {
  const vehicleId = req.params.vehicleId;
  const accessToken = req.query.access_token;

  const options = {
    method: "GET",
    url: vehiclesUrl + "/" + vehicleId + '/doors',
    headers: {
      authorization: "Bearer " + accessToken,
      "content-type": "application/json"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });
});

app.post("/vehicles/:vehicleId/doors", (req, res) => {
  const vehicleId = req.params.vehicleId;
  const accessToken = req.query.access_token;
  const command = req.query.command;

  const dataString = `{ "command": "${command}"}`;

  const options = {
    method: "POST",
    url: vehiclesUrl + "/" + vehicleId + '/doors',
    headers: {
      authorization: "Bearer " + accessToken,
      "content-type": "application/json"
    },
    body: dataString
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is opened at ${process.env.PORT}`)
);
