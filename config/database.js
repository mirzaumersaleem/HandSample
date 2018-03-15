const mySql = require('mysql');

//Providing parameter of user and database to establish connection
var connection = mySql.createConnection({
    host: "192.185.155.25",
    user: "hiksaudi_hassam",
    password: "MujeeB789",
    database: "hiksaudi_js",
    port:"3306"

});


connection.connect(function(err){
    if(err) throw err;
    console.log("Database connected successfully\n");
});

module.exports = connection;