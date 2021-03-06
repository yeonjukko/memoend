/**
 * Created by yeonjukko on 2016. 1. 25..
 */
/**
 * Created by yeonjukko on 2016. 1. 11..
 */

var mysql = require('../manager/MysqlConnectionPool')
var flag = require('../manager/ErrorFlag')
var pool = mysql.mysqlPool;

exports.main = function (req, res) {

    var email = req.query.email;
    var password = req.query.password;

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            return;
        }

        console.log('connected as id ' + db.threadId);

        db.query('SELECT * FROM USER_INFO WHERE USER_ID=?',
            [email],
            function (err, rows) {
                db.release();
                if (!err) {
                    if(rows[0]==null) {
                        res.json(flag.FLAG_LOGIN_FAILED_JSON  );
                        console.log('가입되지 않은 정보입니다.');
                    }else{
                        if(password == rows[0].PASSWORD ){
                            res.json(flag.FLAG_SUCCESS_JSON);
                            console.log('로그인 성공');

                            console.log(rows[0].FIGHTING_WORD+rows[0].COMPANY);

                        }else{
                            res.json(flag.FLAG_LOGIN_FAILED_JSON);
                            console.log('아이디와 비밀번호가 일치하지 않습니다.');
                        }
                    }
                    // res.json(rows);
                }else{
                    console.log(err);
                    res.json(flag.FLAG_ERROR_JSON);
                }
            });


    })

}

