/**
 * Created by yeonjukko on 2016. 1. 11..
 */

var mysql = require('../manager/MysqlConnectionPool')
var flag = require('../manager/ErrorFlag')
var pool = mysql.mysqlPool;

exports.signup = function (req, res) {

    var email = req.query.email;
    var password = req.query.password;
    var fighting_word = req.query.fighting_word;
    var company = req.query.company;

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            return;
        }

        console.log('connected as id ' + db.threadId);

        db.query('INSERT INTO USER_INFO VALUES(?,?,?,?)',
            [email, password, fighting_word, company],
            function (err) {
                if (!err) {
                    //title 기본 추가 설정
                    db.query('INSERT INTO TITLE_INFO (TITLE_NAME,USER_ID) VALUES(?,?)',
                        ['전체 메모', email],
                        function (err,result) {
                            console.log(result);
                            if (!err) {
                                res.json(flag.FLAG_SUCCESS_JSON);
                            }else{
                                console.log(err);
                                res.json(flag.FLAG_ERROR_JSON);
                            }
                            db.release();
                        });

                } else {
                    db.release();
                    console.log(err);
                    res.json(flag.FLAG_SIGNUP_FAILED_JSON);
                }
            });


    });

}

