const mongoose = require("mongoose");
const secret = require('../secrets');

module.exports = function (app) {
  
    const Options = {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }

    mongoose.connect(secret.connection, Options);
    
    mongoose.connection.once('open', function(){
        console.log('connection with Mongo has been successfully established!');
        app.listen(8080, () => console.log("Listening to 8080"));
    }).on('error', function(error){
        console.log("Connection to Mongo Failed: " + error);
    });

}