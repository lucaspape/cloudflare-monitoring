const mysql = require('mysql');

const DBNAME = 'cloudflare';

const mysqlConnection = mysql.createConnection({
    host: 'mariadb',
    user: 'root',
    password: 'password',
    database: DBNAME
  });

function createTables(callback){
  const CREATE_LOG_TABLE = 'create table if not exists logs (timestamp TIMESTAMP,method TEXT, url TEXT, status INT, referer TEXT, user_agent TEXT, protocol TEXT, domain TEXT, origin TEXT, path TEXT, hash TEXT, query TEXT, device_type TEXT, country TEXT, clientIP TEXT, duration INT, country_name TEXT);';

  mysqlConnection.query(CREATE_LOG_TABLE, (err, result) => {
    if(err){
      callback(err);
    }else{
      callback();
    }
  })
}

function insertLog(log, callback){
  const INSERT_LOG_QUERY = 'insert into `' + DBNAME + '`.`logs` (method, url, status, referer, user_agent, protocol, domain, origin, path, hash, query, device_type, country, clientIP, duration, country_name) values (' + mysqlConnection.escape(log.method) + ', ' + mysqlConnection.escape(log.url) + ', ' + mysqlConnection.escape(log.status) + ', ' + mysqlConnection.escape(log.referer) + ', ' + mysqlConnection.escape(log.user_agent) + ', ' + mysqlConnection.escape(log.protocol) + ', ' + mysqlConnection.escape(log.domain) + ', ' + mysqlConnection.escape(log.origin) + ', ' + mysqlConnection.escape(log.path) + ', ' + mysqlConnection.escape(log.hash) + ', ' + mysqlConnection.escape(log.query) + ', ' + mysqlConnection.escape(log.device_type) + ', ' + mysqlConnection.escape(log.country) + ', ' + mysqlConnection.escape(log.clientIP) + ', ' + mysqlConnection.escape(log.duration) + ', ' + mysqlConnection.escape(log.country_name) + ');';

  mysqlConnection.query(INSERT_LOG_QUERY, (err, result) => {
    if(err){
      callback(err);
    }else{
      callback(undefined, result);
    }
  });
}

module.exports = {
  connect: function(callback){
    mysqlConnection.connect((err) => {
      if(err){
        callback(err);
      }else{
        createTables(callback);
      }
    });
  },
  insertLog: insertLog
}
