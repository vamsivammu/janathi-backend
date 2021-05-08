import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello';
  }
}

/*
var queryString = require("querystring");
var crypto = require('crypto');

function signUrl(url, securityKey,videoId, expirationTime = 3600) {
	var hashableBase = "", token = "";
	var expires = Math.floor(new Date() / 1000) + expirationTime;
	hashableBase = securityKey + videoId + expires;
	// token = Buffer.from(crypto.createHash("sha256").update(hashableBase).digest('hex')).toString("base64");
	token = crypto.createHash("sha256").update(hashableBase).digest('hex');
	console.log(token)
	return url + "?token=" + token + "&expires=" + expires;
}
var securityKey = "2a3cf226-394e-46b0-abfb-6d298f10c05e";
var signedUrl = signUrl("https://iframe.mediadelivery.net/embed/2042/0f7f9025-3b11-4b73-a23f-f9a0d3baefe7", securityKey,"0f7f9025-3b11-4b73-a23f-f9a0d3baefe7", 36000);
console.log(signedUrl);
// exports.helloWorld = functions.https.onRequest(app);


*/