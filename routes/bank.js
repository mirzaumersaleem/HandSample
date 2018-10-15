/**
 * Created by Atayyab Owais on 01/03/2018.
 */
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var mysql_raal = require("../config/database");
var mysql = require("../config/bank_db");

var moment = require("moment");
var async = require("async");

var mysqlx = require("mysql");
var Cart = require("../models/cart");
var con = mysqlx.createConnection({
  host: "192.185.82.250",
  user: "myraal_bankuser",
  password: "abc123@@",
  database: "myraal_bank"
});

router.post("/test", (req, res) => {
  // console.log("oye huaye -> " );
  // Promise.using(mysql.getSqlConn(), conn => {
  //console.log("oye huaye -> ", req.User);
  //     const qry = `select * from customers`;
  //     conn.query(qry).then(users => {
  //         console.log(users[0].count);
  //         res.json({ status: 200, data: users });

  //     }).catch(err => {
  //         console.log("oye huaye -> ", req.User);
  //         res.json({ status: 500, message: 'Error ' + err });
  //     });
  // });

  // var iid = req.session.passport.user;
  mysql.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    const query = `select * from customers where id = 17`;
    const query2 = `select * from customers where id = 15`;
    connection.query(query, function(err, rows) {
      connection.query(query2, function(err, rows2) {
        connection.release();
        if (err) {
          res.json({ status: 500, message: "Error " + err });
        } else {
          // console.log("oye huaye -> ", req.session.passport.user, " " + iid);
          //findbyemail(userData.email, function (err, result) {
          res.json({ status: 200, data: rows, rows2 });
          // });
        }
      });
    });
  });
});

router.post("/addFriendSearche", (req, res) => {
  req.checkBody("name");

  mysql.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var cname = "%" + req.body.name + "%";

    //console.log("name - > "+ cname);
    var word = JSON.stringify(cname);
    //console.log("new name - > "+ word);
    const query = `select * from customers where customers.name like ${word}`;

    connection.query(query, (err, rows) => {
      //connection.query(query2, function (err, rows2) {
      connection.release();
      if (err) {
        res.json({ status: 500, message: "Error " + err });
      } else {
        res.json({ status: 200, data: rows });
      }

      //});
    });
  });
});

router.post("/addFriendSearch", (req, res) => {
  req.checkBody("name");
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    var cname = "%" + req.body.name + "%";

    //console.log("name - > "+ cname);
    var word = JSON.stringify(cname);
    //console.log("new name - > "+ word);
    const qry = `select * from customers where customers.name like ${word}`;
    conn
      .query(qry)
      .then(users => {
        res.json({ status: 200, data: users });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error " + err });
      });
  });
});

router.post("/addFriend", (req, res) => {
  req.checkBody("friend_id"); //id returned from addFriendSearch
  let qry = `insert friends set ?`;
  let favData = {};
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("c_id - > "+ req.body.friend_id);

    favData = {
      friend_id: req.body.friend_id,
      customer_id: req.decoded.user_id,
      status: 1,
      //customer_id: '1',
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss")
    };
    //console.log("data - > "+ favData);
    conn
      .query(`insert friends set ?`, favData)
      .then(() => {
        res.json({
          status: 200,
          message: "Friend added Successfully",
          favData
        });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error Occured", err });
      });
  });
});
//not appeared in provided screens but this should be added
router.post("/acceptMoneyMenu", (req, res) => {
  req.checkBody("receiver_id"); // to be replaced by decoded user type object
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    const qry = `select * from receives where receives.receiver_id = ${
      req.body.receiver_id
    } && status = 0`;
    conn
      .query(qry)
      .then(users => {
        res.json({ status: 200, data: users });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error " + err });
      });
  });
});

router.post("/acceptMoneyPage", (req, res) => {
  req.checkBody("id"); // from acceptMoneyMenu
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    const qry = `select * from receives where receives.id = ${req.body.id}`;
    conn
      .query(qry)
      .then(users => {
        res.json({ status: 200, data: users });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error " + err });
      });
  });
});

router.post("/acceptMoney", (req, res) => {
  req.checkBody("id");
  req.checkBody("amount");
  req.checkBody("customer_id"); //will get it from session
  req.checkBody("previous_balance"); //will have to work on getting it
  req.checkBody("ip_address");
  req.checkBody("description");
  //req.checkBody('type');
  req.checkBody("remaining_balance"); // will have to work on getting it
  //let qry = `insert services set ?`;
  let favData = {};
  let upBalance = {};
  let balanceObj = {};
  let accountObj = {};
  let blnObj = {};
  let rcvObj = {};
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    var status_value = 0;
    select = `select * from balances where customer_id = ${
      req.body.customer_id
    }`;
    conn.query(select).then(result => {
      //res.json({ status: 200, message: 'balance added Successfully', upBalance });

      upBalance = {
        amount: req.body.amount,
        customer_id: req.body.customer_id,
        previous_balance: result[0].previous_balance,
        description: req.body.description,
        ip_address: req.body.ip_address,
        type: 1,
        status: 0,
        remaining_balance: result[0].previous_balance + req.body.amount,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        created_at: moment().format("YYYY-MM-DD HH:mm:ss")
      };
    });
    //const upBalance = {amount, customer_id, previous_balance, description, ip_address, type, remaining_balance} = req.body

    conn
      .query(`insert update_balances set ?`, upBalance)
      .then(res => {
        //console.log("first Res -> ",  res);
        return Promise.using(mysql.getSqlConn(), conn => {
          balanceObj = {
            update_balance_id: res.insertId,
            ip_address: req.body.ip_address,
            status: 1,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          // accountObj = {

          //     customer_id: req.body.customer_id,
          //     ip_address: req.body.ip_address,
          //     status: 1,
          //     updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          //     created_at: moment().format('YYYY-MM-DD HH:mm:ss')
          // }
          return conn.qry(`insert update_blance_request set ?`, balanceObj);
        });
        //res.json({ status: 200, message: 'balance added Successfully', upBalance });
      })
      .then(res => {
        return Promise.using(mysql.getSqlConn(), conn => {
          accountObj = {
            customer_id: req.body.customer_id,
            ip_address: req.body.ip_address,
            status: 1,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          return conn.qry(`insert accounts set ?`, accountObj);
        });
      })
      .then(res => {
        return Promise.using(mysql.getSqlConn(), conn => {
          select = `select * from balances where customer_id = ${
            req.body.customer_id
          }`;
          conn.query(select).then(result => {
            blnObj = {
              account_no: result[0].account_no,
              customer_id: req.body.customer_id,
              balance: req.body.amount + result[0].balance, //gonna call encryption here before addition method
              status: 1,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              created_at: result[0].created_at
            };
            return conn.qry(
              `update balances set ? where customer_id = ${
                req.body.customer_id
              }`,
              blnObj
            );
          });
        });
      })
      .then(res => {
        return Promise.using(mysql.getSqlConn(), conn => {
          select = `select * from receives where id = ${req.body.id}`;
          conn.query(select).then(result => {
            rcvObj = {
              receiver_id: result[0].receiver_id,
              sender_id: result[0].sender_id,
              balance: req.body.amount + result[0].balance, //gonna call encryption here before addition method
              status: 1,
              type: result[0].type,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              created_at: result[0].created_at
            };
            return conn.qry(
              `update receives set ? where id = ${req.body.id}`,
              rcvObj
            );
          });
          res.json({ status: 200, message: "balance added Successfully" });
        });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error Occured", err });
      });
  });
});

router.post("/rejectMoney", (req, res) => {
  var user = new User();
  req.checkBody("id");
  req.checkBody("amount");
  req.checkBody("customer_id"); //will get it from session
  req.checkBody("previous_balance"); //will have to work on getting it
  req.checkBody("ip_address");
  req.checkBody("description");
  //req.checkBody('type');
  req.checkBody("remaining_balance"); // will have to work on getting it
  //let qry = `insert services set ?`;
  let favData = {};
  let upBalance = {};
  let balanceObj = {};
  let accountObj = {};
  let blnObj = {};
  //var user = findIdOnUserTable(req.user.id);
  let rcvObj = {};
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    var status_value = 0;
    selectx = `select * from receives where id = ${req.body.id}`;
    conn
      .query(selectx)

      .then(resu => {
        select = `select * from balances where customer_id = ${
          resu[0].sender_id
        }`;
        conn.query(select).then(result => {
          //res.json({ status: 200, message: 'balance added Successfully', upBalance });

          upBalance = {
            amount: req.body.amount,
            customer_id: resu[0].sender_id,
            previous_balance: result[0].previous_balance,
            description: req.body.description,
            ip_address: req.body.ip_address,
            type: 1,
            status: 2,
            remaining_balance: result[0].previous_balance + req.body.amount,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          };
        });
        //const upBalance = {amount, customer_id, previous_balance, description, ip_address, type, remaining_balance} = req.body

        conn
          .query(`insert update_balances set ?`, upBalance)
          .then(res => {
            //console.log("first Res -> ",  res);
            return Promise.using(mysql.getSqlConn(), conn => {
              balanceObj = {
                update_balance_id: res.insertId,
                ip_address: req.body.ip_address,
                status: 2,
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                created_at: moment().format("YYYY-MM-DD HH:mm:ss")
              };
              // accountObj = {

              //     customer_id: req.body.customer_id,
              //     ip_address: req.body.ip_address,
              //     status: 1,
              //     updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              //     created_at: moment().format('YYYY-MM-DD HH:mm:ss')
              // }
              return conn.qry(`insert update_blance_request set ?`, balanceObj);
            });
            //res.json({ status: 200, message: 'balance added Successfully', upBalance });
          })
          .then(res => {
            return Promise.using(mysql.getSqlConn(), conn => {
              accountObj = {
                customer_id: resu[0].sender_id,
                ip_address: req.body.ip_address,
                status: 1,
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                created_at: moment().format("YYYY-MM-DD HH:mm:ss")
              };
              return conn.qry(`insert accounts set ?`, accountObj);
            });
          })
          .then(res => {
            return Promise.using(mysql.getSqlConn(), conn => {
              select = `select * from balances where customer_id = ${
                resu[0].sender_id
              }`;
              conn.query(select).then(result => {
                blnObj = {
                  account_no: result[0].account_no,
                  customer_id: resu[0].sender_id,
                  balance: req.body.amount + result[0].balance, //gonna call encryption here before addition method
                  status: 1,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  created_at: result[0].created_at
                };
                return conn.qry(
                  `update balances set ? where customer_id = ${
                    req.body.customer_id
                  }`,
                  blnObj
                );
              });
            });
          })
          .then(res => {
            return Promise.using(mysql.getSqlConn(), conn => {
              select = `select * from receives where id = ${req.body.id}`;
              conn.query(select).then(result => {
                rcvObj = {
                  receiver_id: result[0].receiver_id,
                  sender_id: result[0].sender_id,
                  balance: req.body.amount + result[0].balance, //gonna call encryption here before addition method
                  status: 2,
                  type: result[0].type,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  created_at: result[0].created_at
                };
                return conn.qry(
                  `update receives set ? where id = ${req.body.id}`,
                  rcvObj
                );
              });
              res.json({
                status: 200,
                message: "balance added back to senders account Successfully"
              });
            });
          })
          .catch(err => {
            res.json({ status: 500, message: "Error Occured", err });
          });
      });
  });
});

router.post("/addMoney", (req, res) => {
  req.checkBody("customer_id"); // will fetch it from session
  req.checkBody("amount");
  req.checkBody("pin");
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    const qry = `select balance as current_balance from balances where customer_id = ${
      req.body.customer_id
    }`;
    conn
      .query(qry)
      .then(users => {
        res.json({ status: 200, data: users });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error " + err });
      });
  });
});

router.post("/addMoneyVerified", (req, res) => {
  req.checkBody("amount");
  req.checkBody("customer_id"); //will get it from session
  req.checkBody("ip_address");
  let favData = {};
  let upBalance = {};
  let balanceObj = {};
  let accountObj = {};
  let blnObj = {};
  let rcvObj = {};
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    var status_value = 0;
    select = `select * from balances where customer_id = ${
      req.body.customer_id
    }`;
    conn.query(select).then(result => {
      //res.json({ status: 200, message: 'balance added Successfully', upBalance });

      upBalance = {
        amount: req.body.amount,
        customer_id: req.body.customer_id,
        previous_balance: result[0].previous_balance,
        description: "Payment transfered to the account VIA PayTab",
        ip_address: req.body.ip_address,
        type: 1,
        status: 1,
        remaining_balance: result[0].previous_balance + req.body.amount,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        created_at: moment().format("YYYY-MM-DD HH:mm:ss")
      };
    });
    //const upBalance = {amount, customer_id, previous_balance, description, ip_address, type, remaining_balance} = req.body

    conn
      .query(`insert update_balances set ?`, upBalance)
      .then(res => {
        //console.log("first Res -> ",  res);
        return Promise.using(mysql.getSqlConn(), conn => {
          balanceObj = {
            update_balance_id: res.insertId,
            ip_address: req.body.ip_address,
            status: 1,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          return conn.qry(`insert update_blance_request set ?`, balanceObj);
        });
        //res.json({ status: 200, message: 'balance added Successfully', upBalance });
      })
      .then(res => {
        return Promise.using(mysql.getSqlConn(), conn => {
          accountObj = {
            customer_id: req.body.customer_id,
            balance: req.body.amount,
            status: 1,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          return conn.qry(`insert accounts set ?`, accountObj);
        });
      })
      .then(res => {
        return Promise.using(mysql.getSqlConn(), conn => {
          select = `select * from balances where customer_id = ${
            req.body.customer_id
          }`;
          conn.query(select).then(result => {
            blnObj = {
              account_no: result[0].account_no,
              customer_id: req.body.customer_id,
              balance: req.body.amount + result[0].balance, //gonna call encryption here before addition method
              status: 1,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              created_at: result[0].created_at
            };
            return conn.qry(
              `update balances set ? where customer_id = ${
                req.body.customer_id
              }`,
              blnObj
            );
          });
        });
        res.json({
          status: 200,
          message: "Money added to account Successfully"
        });
      })
      .catch(err => {
        res.json({ status: 500, message: "Error Occured", err });
      });
  });
});

router.post("/verifyPinAddMoney", (req, res) => {
  req.checkBody("customer_id"); //will replace it with the session one
  req.checkBody("pin");
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name

    const qry = `select secret_password as pin from customers where customer_id = ${
      req.body.customer_id
    }`;
    conn
      .query(qry)
      .then(users => {
        if (users[0].pin == req.body.pin) {
          res.json({ status: 200, message: "Verified" });
        } else {
          res.json({ status: 500, message: "Incorrect Pin " });
        }
      })
      .catch(err => {
        res.json({ status: 500, message: "Error " + err });
      });
  });
});

router.post("/payTransaction", (req, res) => {
  // req.checkBody("amount");
  // req.checkBody("customer_id"); //will get it from session
  // req.checkBody("ip_address");
  // req.checkBody("account_number");
  // req.checkBody("description");
  // let favData = {};
  // let upBalance = {};
  // let balanceObj = {};
  // let accountObj = {};
  // let blnObj = {};
  // let rcvObj = {};
  // console.log("id",req.user.id);
  // Promise.using(mysql.getSqlConn(), conn => {
  //   //console.log("name - > "+ req.body.name);
  //   //searching on the basis of name
  //   var status_value = 0;
  //   select = `select * from balances where customer_id = ${
  //     req.user.id
  //   }`;
  //   conn.query(select).then(result => {
  //     //res.json({ status: 200, message: 'balance added Successfully', upBalance });
  //     upBalance = {
  //       amount: req.body.amount,
  //       customer_id: req.user.id,
  //       previous_balance: result[0].previous_balance,
  //       description: req.body.description,
  //       ip_address: req.body.ip_address,
  //       type: 2,
  //       status: 0,
  //       remaining_balance: result[0].previous_balance - req.body.amount,
  //       updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  //       created_at: moment().format("YYYY-MM-DD HH:mm:ss")
  //     };
  //   });
  //   conn
  //     .query(`insert update_balances set ?`, upBalance)
  //     .then(res => {
  //       return Promise.using(mysql.getSqlConn(), conn => {
  //         balanceObj = {
  //           update_balance_id: res.insertId,
  //           ip_address: req.body.ip_address,
  //           status: 0,
  //           updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  //           created_at: moment().format("YYYY-MM-DD HH:mm:ss")
  //         };
  //         return conn.qry(`insert update_blance_request set ?`, balanceObj);
  //       });
  //       res.json({
  //         status: 200,
  //         message: "Transaction Succeed",
  //         transaction_id: res.insertId,
  //         account_no: req.body.account_no
  //       });
  //     })
  //     .catch(err => {
  //       res.json({ status: 500, message: "Error Occured", err });
  //     });
  // });
});

router.post("/verifyPinTransaction", (req, res) => {
  req.checkBody("customer_id"); //will replace it with the session one
  req.checkBody("pin");
  req.checkBody("transaction_id");
  req.checkBody("account_number");
  let favData = {};
  let upBalance = {};
  let balanceObj = {};
  let accountObj = {};
  let blnObj = {};
  let rcvObj = {};
  Promise.using(mysql.getSqlConn(), conn => {
    //console.log("name - > "+ req.body.name);
    //searching on the basis of name
    var status_value = 0;
    const select = `select secret_password as pin from customers where customer_id = ${
      req.body.customer_id
    }`;
    conn
      .query(select)
      .then(result => {
        //res.json({ status: 200, message: 'balance added Successfully', upBalance });
        if (result[0].pin == req.body.pin) {
          const slct = `select * from update_balances where id = ${
            req.body.transaction_id
          }`;
          conn.query(slct).then(ress => {
            upBalance = {
              amount: ress[0].amount,
              customer_id: req.body.customer_id,
              previous_balance: ress[0].previous_balance,
              description: ress[0].description,
              ip_address: ress[0].ip_address,
              type: 2,
              status: 1,
              remaining_balance: ress[0].remaining_balance,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              created_at: moment().format("YYYY-MM-DD HH:mm:ss")
            };
          });
          conn
            .query(`insert update_balances set ?`, upBalance)
            .then(res => {
              //console.log("first Res -> ",  res);
              return Promise.using(mysql.getSqlConn(), conn => {
                balanceObj = {
                  update_balance_id: res.insertId,
                  ip_address: ress[0].ip_address,
                  status: 1,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  created_at: moment().format("YYYY-MM-DD HH:mm:ss")
                };
                return conn.qry(
                  `insert update_blance_request set ?`,
                  balanceObj
                );
              });
              //res.json({ status: 200, message: 'balance added Successfully', upBalance });
            })
            .then(res => {
              return Promise.using(mysql.getSqlConn(), conn => {
                accountObj = {
                  customer_id: req.body.customer_id,
                  ip_address: ress[0].ip_address,
                  status: 1,
                  updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                  created_at: moment().format("YYYY-MM-DD HH:mm:ss")
                };
                return conn.qry(`insert accounts set ?`, accountObj);
              });
            })
            .then(res => {
              return Promise.using(mysql.getSqlConn(), conn => {
                select = `select customer_id as receiver_id from balances where account_no = ${
                  req.body.account_number
                }`;
                conn.query(select).then(result => {
                  rcvObj = {
                    receiver_id: result[0].receiver_id,
                    sender_id: req.body.customer_id,
                    status: 0,
                    type: 3,
                    balance: ress[0].amount,
                    description: ress[0].description,
                    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss")
                  };
                  return conn.qry(`insert receives set ?`, rcvObj);
                });
              });
            })
            .then(res => {
              return Promise.using(mysql.getSqlConn(), conn => {
                select = `select * from balances where customer_id = ${
                  req.body.customer_id
                }`;
                conn.query(select).then(result => {
                  blnObj = {
                    account_no: result[0].account_no,
                    customer_id: req.body.customer_id,
                    balance: result[0].balance - ress[0].amount, //gonna call encryption here before addition method
                    status: 1,
                    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    created_at: result[0].created_at
                  };
                  return conn.qry(
                    `update balances set ? where customer_id = ${
                      req.body.customer_id
                    }`,
                    blnObj
                  );
                });
              });
              res.json({
                status: 200,
                message: "Money transaction processed Successfully"
              });
            })
            .catch(err => {
              res.json({ status: 500, message: "Error Occured", err });
            });
        } else {
          res.json({ status: 500, message: "Pin Doesn't match" });
        }
      })
      .catch(err => {
        res.json({ status: 500, message: "Error Occured in Pin Querry", err });
      });
    //const upBalance = {amount, customer_id, previous_balance, description, ip_address, type, remaining_balance} = req.body
  });
});

router.get("/getBankAccount", (req, res) => {
  var cart = new Cart(req.session.cart);
  let id = 0;
  if (req.session.cart == "undefined") {
    res.json({ status: 500, message: "Branch Id not found" });
  } else {
    // id : else_1
    console.log("user.branch_id", req.user);
    const qry_raal = `select id from admins where branch_id=${
      req.session.cart.branchId
    }`;
    mysql_raal.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(qry_raal, (err, rows_raal) => {
        connection.release();
        if (err) {
          res.json({ status: 500, message: "Error " + err });
        } else {
          if (rows_raal.length!=0){
         // console.log("rows_raal", rows_raal[0].id);
         const qry = `SELECT account_no FROM balances where customer_id IN (SELECT id from customers where admin_id= ${rows_raal[0].id})`;
   
          mysql.getConnection(function(err, connection) {
            if (err) {
              throw err;
            }
            connection.query(qry, (err, rows) => {
              connection.release();
              if (err) {
                res.json({ status: 500, message: "Error " + err });
              } else {
                req.session.cart = null;
                res.json({ status: 200, data: rows });
              }
            }); 
          });
          }else{
            res.json({ status: 300, message: "No Account Found for selected branch" });
          } // if close
        } // else close
      });
    });
  } // else_1 close
});

module.exports = router;
