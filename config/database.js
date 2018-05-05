const mySql = require('mysql');

//Providing parameter of user and database to establish connection
var connection = mySql.createConnection({
    host: "192.185.82.250",
    user: "myraal_MianRoot",
    password: "raal123@",
    database: "myraal_raal",
    port:"3306"

});
connection.connect(function(err){
    if(err) throw err;
    console.log("Database connected successfully\n");
});

module.exports = connection;