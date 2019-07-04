start server
``node app.js``
#####goto browser to see the barcode to scan
http://localhost:3000/totp/process

#####use the postman collection ``2fa.postman_collection.json`` to...
...get a secret with ``/totp/secret``  
...validate the generated code with ``/totp/validate``

#####to scan the code use eighter...
...Google Authenticator
    Android --> https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=de_CH \
    iOS --> https://apps.apple.com/ch/app/google-authenticator/id388497605
    
...Authy
    Android --> https://play.google.com/store/apps/details?id=com.authy.authy&hl=de \
    iOS --> https://apps.apple.com/de/app/authy/id494168017
    
(btw: Authy is way better...)