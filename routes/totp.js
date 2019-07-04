const express = require('express');
const router = express.Router();
const Speakeasy = require("speakeasy");
const QRCode = require('qrcode');

let globalTFA = {};

//todo: two options:
//  1. make urls dynamic and use hashed-user-id in the path to map user to secret and store to databaser
//  2. get user-identifier with request body and and also map secret to user in database
router.post('/secret', function (req, res, next) {

    let secret = Speakeasy.generateSecret({length: 10});

    res.send({"secret": secret.base32});

});

router.get('/generate', function (req, res, next) {
    res.send({
        //this part should be handled by the client such as an authentication client like google authenticator (or the code below if you want to implement by yourself),
        // and NOT the server! it is just for demo purposes here
        "token": Speakeasy.totp({
            secret: req.body.secret,
            encoding: "base32"
        }),
        "remaining": (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
    });
});

router.get('/validate', function (req, res, next) {


    //todo: get secret-Object from database. it should be assosiated with the user, and NOT red from the request.
    res.send({
        "valid": Speakeasy.totp.verify({
            secret: req.body.secret,
            encoding: "base32",
            token: req.body.token,
            window: 0
        })
    });
});

router.get('/process', function (req, res, next) {

    //todo: move generate secret to the route /secret.
    //do not use blanks or special chars in this strings, because urlencoding doesn't work properly!!
    let secret = Speakeasy.generateSecret({
        length: 20,
        name: "theuser",
        encoding: "base32",
        issuer: "theusersapp"
    });

    //todo: implement database and get infos from database
    //do not use blanks or special chars in this strings, because urlencoding doesn't work properly!!
    let url = Speakeasy.otpauthURL({
        encoding: "base32",
        secret: secret.base32,
        issuer: "theusersapp",
        label: "theuser"

    });

    //do not use blanks or special chars in this strings, because urlencoding doesn't work properly!!
    QRCode.toDataURL(url, (err, dataURL) => {
        globalTFA = {
            secret: "",
            tempSecret: secret.base32,
            dataURL,
            tfaURL: url
        };

        return res.render("2fa", {dataURL: globalTFA.dataURL})
    });
});
module.exports = router;
