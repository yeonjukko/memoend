/**
 * Created by yeonjukko on 2016. 1. 13..
 */


var app_user = angular.module('memoend_user', []);
app_user.controller('loginCtrl', function ($scope, $http, $window) {
    $scope.sendLogin = function () {
        console.log('test');
        $http.get("/login?email=" + $scope.login.email +
            "&password=" + $scope.login.password).success(function (data) {
            $window.location.href = "http://" + $window.location.host + "/main.html";
        });
    }
});

app_user.controller('signupCtrl', function ($scope, $http) {
    $scope.sendSignUp = function () {
        //if ($scope.signup.email = '') {
        //    toastr.error('이메일을 입력해주세요.');
        //} else if ($scope.signup.password = '') {
        //    toastr.error('비밀번호를 입력해주세요.');
        //} else if ($scope.signup.company = '') {
        //    toastr.error('목표를 입력해주세요.');
        //} else if ($scope.signup.fighting_word = '') {
        //    toastr.error('화이팅문구를 입력해주세요.');
        //}
        $http.get("/signup?email=" + $scope.signup.email +
            "&password=" + $scope.signup.password +
            "&company=" + $scope.signup.company +
            "&fighting_word=" + $scope.signup.fighting_word).success(function (data) {
            console.log(data);
        });
    };
});


var app = angular.module('memoend', ['textAngular']);


app.controller('initLoadCtrl', function ($scope, $http) {

    var current_memo_id = null;
    var title_data = [];
    var process = true;//default 가 view_mode 구현

    //<--로딩--
    $scope.mTitleLoad = function () {
        $http.get('/mTitleLoader').success(function (data) {

            if (data.code == 2000) {
                $scope.title_data = [];
                for (var i = 0; i < data.contents.length; i++) {
                    $scope.title_data[i] = {
                        title_name: data.contents[i].TITLE_NAME,
                        title_id: data.contents[i].TITLE_ID
                    }
                }

                //타이틀 데이터를 불러온후 second nav의 데이터를 불러옴
                $scope.mMemoLoad(process);

            } else if (data.code == 4005) {
                console.log('없져');
            }

        });
    }

    $scope.mMemoLoad = function (process) {
        $http.get('/mAllNameLoader').success(function (data) {
            if (data.code == 2000) {
                $scope.midTitles = data.contents;
                if (process == true) {
                    $scope.mDataLoad(data.contents[0]); //디폴트
                } else {
                    $scope.mDataLoad2(data.contents[0]); //메모 추가, 수정
                }
                $scope.memoLength = data.contents.length;

            } else if (data.code == 4005) {
                console.log('없져');
            }
        });

    };
    //<--로딩-->


    $scope.title_id = 0;

    //case1. 뷰모드
    $scope.mDataLoad = function (data) {
        current_memo_id = data.MEMO_ID;
        $scope.editor_hide = false;
        console.log('mDataLoad1 뷰모드');
        $http.get('/mDataLoader?memo_id=' + data.MEMO_ID).success(function (data) {

            if (data.code == 2000) {

                $scope.title_id = data.contents[0].TITLE_ID;
                $scope.writeDate = data.contents[0].TIMESTAMP;
                $scope.htmlContent = data.contents[0].CONTENT;
                $scope.selectedItem = $scope.title_id;

            } else if (data.code == 4005) {
                console.log('없져');
            }
        });
    };
    //case2. 수정모드
    $scope.mDataLoad2 = function (data) {
        current_memo_id = data.MEMO_ID;
        $scope.editor_hide = true;
        console.log('mDataLoad2 에디트모드');

        $http.get('/mDataLoader?memo_id=' + data.MEMO_ID).success(function (data) {

            if (data.code == 2000) {

                $scope.title_id = data.contents[0].TITLE_ID;
                $scope.writeDate = data.contents[0].TIMESTAMP;
                $scope.htmlContent = data.contents[0].CONTENT;
                $scope.selectedItem = $scope.title_id;

            } else if (data.code == 4005) {
                console.log('없져');
            }
        });
    };
    //<--타이틀 추가--
    var title_input_hide = true;
    $scope.toggle_title_input = function () {
        $scope.title_input_hide = !$scope.title_input_hide;
    };

    $scope.mNewTitle = function(data){

        $scope.toggle_title_input();
        console.log(data);
        $http.get('./mNewTitle?title_name='+data).success(function(data){
            if (data.code == 2000) {
                $scope.mTitleLoad();

            } else if (data.code == 4005) {
                console.log('없져');
            }
        });
    };

    //<--메모 추가 및 수정--
    $scope.mNewMemo = function () {
        $scope.editor_hide = true;
        $scope.htmlContent = "";

        var query = {
            title_id: Number($scope.selectedItem),
            memo_name: $scope.removeTag($scope.htmlContent),
            content: "",
            timestamp: new Date().getTime()

        };

        $http.post('/mNewMemo', query).success(function (data) {
            if (data.code == 2000) {
                console.log('성공했져  ');
                $scope.mMemoLoad(false);

            } else if (data.code == 4005) {
                console.log('없져');
            }
        });
        $scope.editor_hide = true;


    };

    $scope.selectedItem = 0;

    $scope.mModiMemo = function (data) {
        $scope.toggleHide();

        var query = {
            memo_id: current_memo_id,
            title_id: Number($scope.selectedItem),
            memo_name: $scope.removeTag($scope.htmlContent),
            content: $scope.htmlContent,
            timestamp: new Date().getTime()
        };

        console.log($scope.removeTag($scope.htmlContent));
        $http.post('/mModiMemo', query).success(function (data) {
            console.log(data);
            if (data.code == 2000) {
                console.log('성공했져  ');
                $scope.mMemoLoad(true);


            } else if (data.code == 4005) {
                console.log('없져');
            }
        });


    };
    //--메모 추가 및 수정-->


    //<--view mode 관련 코드

    $scope.removeTag = function (html) {
        var pattern = /<[^>]+>/g;
        var mHtml = html.replace(pattern, '').substr(0, 14);
        if (html.length > 14)
            mHtml = mHtml.concat(' ...');
        return mHtml;

    };

    $scope.editor_hide = false; //기본은 뷰모드 false
    $scope.toggleHide = function () {
        $scope.editor_hide = !$scope.editor_hide;
    };

    //--view mode 관련 코드-->


});



