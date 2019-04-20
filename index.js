require("dotenv").config();

const express = require("express");
const request = require("request");

const app = express();
app.use(express.static(__dirname + "/public"));

app.get("/oauth/redirect", (req, res) => {
  const requestToken = req.query.code;

  var options = {
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
    console.log(body);

    const accessToken = body.access_token;
    var options = {
      method: "GET",
      url:
        "https://api.mercedes-benz.com/experimental/connectedvehicle/v1/vehicles/",
      headers: {
        authorization: "Bearer " + accessToken,
        "content-type": "application/json"
      }
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      console.log(JSON.parse(body));
      var parsedBody = JSON.parse(body);

      const vehicleId = parsedBody[0].id;
      var options = {
        method: "GET",
        url:
          "https://api.mercedes-benz.com/experimental/connectedvehicle/v1/vehicles/" +
          vehicleId,
        headers: {
          authorization: "Bearer " + accessToken,
          "content-type": "application/json"
        }
      };

      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      });
    });
  });
});

app.get("/unlock", (req, res) => {});

app.get("/lock", (req, res) => {});

app.listen(8080, () => console.log("Server is open at 8080"));
