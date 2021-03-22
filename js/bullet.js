$('#restart').hide();
$(function () {
    var p1p2 = true; //按鈕change切換p1p2邏輯
    var beginstart = false; //按鈕切換
    var clearaddcard = 0; //計算start按幾次
    var i = 0; // 翻開的度數
    var temp; // 暫存function
    var pickcard; // 收取個別的牌
    var openlist = []; // 收取pickcard
    var again = []; // 不能重複的list
    var cardreturn; //翻回
    var k = 180; //蓋牌的度數
    var turning = false; // 避免在翻牌的時候又再次點到報錯
    var p1attack = 0; // p1的攻擊力
    var p2attack = 0; // p2的攻擊力
    var winner = false; // 勝利後不得翻牌
    // start按鈕
    $('#start').click(function () {
        clearaddcard += 1;
        if (clearaddcard == 4) { // 按到第四次
            again = []; // 清除不能重複的list
            clearaddcard = 0; // 清除start計算
        }
        beginstart = true;
        $('#start, #change').hide();
        $('#restart').show();
    })

    //按鈕change 切換p1p2
    $('#change').click(function () {
        var tmp; // 暫存要更換的數字
        if (p1p2) {
            $('#comp1').css('color', 'aqua').text('P2');
            $('#comp2').css('color', 'lightcoral').text('P1');
            // 更換數字
            tmp = $('#point1').text();
            $('#point1').text(`${$('#point2').text()}`);
            $('#point2').text(`${tmp}`);
            p1p2 = false; // 切換了
        } else {
            $('#comp1').css('color', 'lightcoral').text('P1');
            $('#comp2').css('color', 'aqua').text('P2');
            // 更換數字
            tmp = $('#point1').text();
            $('#point1').text(`${$('#point2').text()}`);
            $('#point2').text(`${tmp}`);
            p1p2 = true; // 切回到原來的樣子
        }
    })

    // 作亂數不重複丟牌
    function addcard() {
        again[again.length] = (`${Math.floor(Math.random() * 57 + 1)}`).padStart(3, '0');
        if ((again.length - 1) > 0) {
            for (var k = 0; k < (again.length - 1); k++) {
                if (again[k] == again[again.length - 1]) {
                    var tmp = again.pop();
                    addcard();
                }
            }
        }
        return again[again.length - 1]
    }
    // 攻擊特效數字左右擺動
    function movingnum(index) {
        $(index).animate({ 'left': '-=10px' }, 100).animate({ 'left': '+=20px' }, 100).animate({ 'left': '-=20px' }, 100).animate({ 'left': '+=10px' }, 100);
    }
    // 點擊卡背
    $('.cardback').click(function () {
        // 要先按start才可以按卡背
        if (beginstart && turning == false && winner == false) {
            pickcard = this; // 讓裡面的function也可以同樣使用，所以丟在一個變數裡
            var checkick = false; //若為ture確認踢掉，翻過的牌不會再翻
            // 確認checkick
            for (var kick of openlist) { // 辨認有沒有翻過
                if (kick == pickcard) {
                    checkick = true; // 有翻過
                    openlist.pop();
                }
            }
            openlist[openlist.length] = pickcard; //收取pickcard
            if (checkick == false) { // 沒有翻過
                turning = true; //翻牌中
                temp = setInterval(function () {
                    i += 5; // 每次轉的角度+5
                    $(pickcard).css('transform', `rotatey(${i}deg)`);
                    $(pickcard).prev('.cardfront').css('transform', `rotatey(${i - 180}deg)`);
                    if (i == 90) { // 轉角90度
                        $(pickcard).attr('src', `../img/Pokemon/${addcard()}.png`) // 換神奇寶貝
                        if ((i - 180) == -90) {
                            $(pickcard).prev('.cardfront').text(`${attackform(again[again.length - 1])}`).css({ 'z-index': '1' });
                        }
                        if (openlist.length % 2 == 1) { // 讓點擊可以有所區分
                            $(pickcard).css('background-color', 'lightcoral');
                        } else {
                            $(pickcard).css('background-color', 'aqua');
                        }
                        $(pickcard).css('box-shadow', '0 0 0 0 white');
                    } else if (i == 180) { //轉角180度
                        i = 0; // 清除角度
                        turning = false; // 翻牌完了
                        clearInterval(temp); // 清除setInterval
                    }
                }, 5)
            }

            // 讓卡片旋轉完再做判斷傷害
            setTimeout(function () {
                var sum = 0;
                if (openlist.length % 2 == 1) {
                    p1attack = attackform(again[again.length - 1]);
                } else {
                    p2attack = attackform(again[again.length - 1]);
                    if (p1p2) {
                        if (p1attack > p2attack) { // 計算傷害
                            sum = p1attack - p2attack;
                            $('#point2').text(`${$('#point2').text() - (sum)}`);
                            movingnum('#point2');
                            if ($('#point2').text() - (sum) <= 0) { // 若為0則0
                                $('#point2').text('0');
                            }
                        } else if (p1attack < p2attack) {
                            sum = p2attack - p1attack;
                            $('#point1').text(`${$('#point1').text() - sum}`);
                            movingnum('#point1');
                            if ($('#point1').text() - sum <= 0) { // 若為0則0
                                $('#point1').text('0');
                            }
                        }
                    } else {
                        if (p1attack > p2attack) { // 計算傷害
                            sum = p1attack - p2attack;
                            $('#point1').text(`${$('#point1').text() - sum}`);
                            movingnum('#point1');
                            if ($('#point1').text() - sum <= 0) { // 若為0則0
                                $('#point1').text('0');
                            }
                        } else if (p1attack < p2attack) {
                            sum = p2attack - p1attack;
                            $('#point2').text(`${$('#point2').text() - sum}`);
                            movingnum('#point2');
                            if ($('#point2').text() - sum <= 0) { // 若為0則0
                                $('#point2').text('0');
                            }
                        }
                    }



                    // 不使用restart恢復
                    if (openlist.length >= 16) { // 打開牌的張數
                        setTimeout(function () {
                            openlist = []; // 將打開牌的list清空
                            cardreturn = setInterval(function () {
                                k += 5; // 角度+5
                                $('.cardback').css('transform', `rotatey(${k}deg)`);
                                $('.cardfront').css('transform', `rotatey(${k - 180}deg)`); // 戰鬥指數翻轉
                                if ((k - 180) == 90) {
                                    $('.cardfront').css('z-index', '-1').text(''); // 隱藏在背卡後
                                }
                                if (k == 270) { // 角度270度
                                    $('.cardback').css('background-color', 'white'); // 將顏色變回白
                                    $('.cardback').css('box-shadow', '5px 5px 5px 5px gray'); // 將陰影變回來
                                    $('.cardback').attr('src', '../img/pokeball.png'); // 將背卡變回來
                                } else if (k == 360) { // 角度360度
                                    k = 180; //角度回到180度
                                    clearInterval(cardreturn); // 清除setInterval
                                }
                            }, 10);
                        }, 1000);
                    }

                    // 勝利後的初始化
                    if ($('#point1').text() == 0 || $('#point2').text() == 0) {

                        winner = true; // 勝利時不得翻牌
                        setTimeout(function () { // 避免太快爆出以下功能
                            beginstart = false; // 按鈕切換

                            // 透過for迴圈將被翻牌的class加上test
                            for (var l of openlist) {
                                $(l).attr('class', 'cardback test');
                            }
                            // 只將有test的class翻回
                            allcardreturn = setInterval(function () {
                                k += 5; // 角度+5
                                $('.test').css('transform', `rotatey(${k}deg)`);
                                $('.test').prev('.cardfront').css('transform', `rotatey(${k - 180}deg)`);
                                if ((k - 180) == 90) {
                                    $('.test').prev('.cardfront').css('z-index', '-1').text('');
                                }
                                if (k == 270) { // 角度270度
                                    $('.test').css('background-color', 'white'); // 將顏色變回白
                                    $('.test').css('box-shadow', '5px 5px 5px 5px gray'); // 將陰影變回來
                                    $('.test').attr('src', '../img/pokeball.png'); // 將背卡變回來
                                } else if (k == 360) { // 角度360度
                                    k = 180; //角度回到180度
                                    $('.cardback').attr('class', 'cardback') // 回復成原本只有一個的class
                                    clearInterval(allcardreturn); // 清除setInterval
                                }
                            }, 5)
                            openlist = []; // 將打開牌的list清空

                            //將所有牌不論有沒有翻過都翻過去

                            // cardreturn = setInterval(function () {
                            //     k += 5; // 角度+5
                            //     $('.cardback').css('transform', `rotatey(${k}deg)`);
                            //     $('.cardfront').css('transform', `rotatey(${k - 180}deg)`);
                            //     if ((k - 180) == 90) {
                            //         $('.cardfront').css('z-index', '-1').text('');
                            //     }
                            //     if (k == 270) { // 角度270度
                            //         $('.cardback').css('background-color', 'white'); // 將顏色變回白
                            //         $('.cardback').css('box-shadow', '5px 5px 5px 5px gray'); // 將陰影變回來
                            //         $('.cardback').attr('src', '../img/pokeball.png'); // 將背卡變回來
                            //     } else if (k == 360) { // 角度360度
                            //         k = 180; //角度回到180度
                            //         clearInterval(cardreturn); // 清除setInterval
                            //     }
                            // }, 10);



                            $('#restart').hide();
                            $('#start, #change').show();
                            setTimeout(function () { // 避免太快alert
                                if ($('#point1').text() == 0) {
                                    alert("P2 is winner!!!")
                                } else {
                                    alert("P1 is winner!!!")
                                }
                            }, 400)
                            $('#point1').text('3000');
                            $('#point2').text('3000');
                            winner = false; // 勝利結束可以翻牌
                        }, 1000)

                    }
                }
            }, 300) // 旋轉完的時間
        }
    })
    // restart按鈕
    $('#restart').click(function () {
        // 將所有重置
        beginstart = false; // 按鈕切換
        // 透過for迴圈將被翻牌的class加上test
        for (var l of openlist) {
            $(l).attr('class', 'cardback test');
        }
        // 只將有test的class翻回
        allcardreturn = setInterval(function () {
            k += 5; // 角度+5
            $('.test').css('transform', `rotatey(${k}deg)`);
            $('.test').prev('.cardfront').css('transform', `rotatey(${k - 180}deg)`);
            if ((k - 180) == 90) {
                $('.test').prev('.cardfront').css('z-index', '-1').text('');
            }
            if (k == 270) { // 角度270度
                $('.test').css('background-color', 'white'); // 將顏色變回白
                $('.test').css('box-shadow', '5px 5px 5px 5px gray'); // 將陰影變回來
                $('.test').attr('src', '../img/pokeball.png'); // 將背卡變回來
            } else if (k == 360) { // 角度360度
                k = 180; //角度回到180度
                $('.cardback').attr('class', 'cardback') // 回復成原本只有一個的class
                clearInterval(allcardreturn); // 清除setInterval
            }
        }, 5)
        again = []; // 清空不能重複的list
        openlist = []; // 將打開牌的list清空
        $('#point1').text('3000');
        $('#point2').text('3000');
        $('#restart').hide();
        $('#start, #change').show();


        // 本來的功能是按restart才會將牌翻回
        // if (openlist.length >= 16) { // 打開牌的張數
        //     beginstart = false; // 按鈕切換
        //     openlist = []; // 將打開牌的list清空
        //     cardreturn = setInterval(function () {
        //         k += 5; // 角度+5
        //         $('.cardback').css('transform', `rotatey(${k}deg)`);
        //         $('.cardfront').css('transform', `rotatey(${k - 180}deg)`); // 戰鬥指數翻轉
        //         if ((k - 180) == 90) {
        //             $('.cardfront').css('z-index', '-1').text(''); // 隱藏在背卡後
        //         }
        //         if (k == 270) { // 角度270度
        //             $('.cardback').css('background-color', 'white'); // 將顏色變回白
        //             $('.cardback').css('box-shadow', '5px 5px 5px 5px gray'); // 將陰影變回來
        //             $('.cardback').attr('src', '../img/pokeball.png'); // 將背卡變回來
        //         } else if (k == 360) { // 角度360度
        //             k = 180; //角度回到180度
        //             clearInterval(cardreturn); // 清除setInterval
        //         }
        //     }, 10);
        //     $('#restart').hide();
        //     $('#start, #change').show();
        // }
    })
    // 戰鬥指數
    function attackform(atk) {
        switch (atk) {
            case '001':
                return 150;
                break;
            case '002':
                return 300;
                break;
            case '003':
                return 600;
                break;
            case '004':
                return 150;
                break;
            case '005':
                return 300;
                break;
            case '006':
                return 600;
                break;
            case '007':
                return 150;
                break;
            case '008':
                return 300;
                break;
            case '009':
                return 600;
                break;
            case '010':
                return 50;
                break;
            case '011':
                return 200;
                break;
            case '012':
                return 450;
                break;
            case '013':
                return 50;
                break;
            case '014':
                return 200;
                break;
            case '015':
                return 450;
                break;
            case '016':
                return 100;
                break;
            case '017':
                return 200;
                break;
            case '018':
                return 500;
                break;
            case '019':
                return 100;
                break;
            case '020':
                return 250;
                break;
            case '021':
                return 100;
                break;
            case '022':
                return 500;
                break;
            case '023':
                return 150;
                break;
            case '024':
                return 400;
                break;
            case '025':
                return 600;
                break;
            case '026':
                return 800;
                break;
            case '027':
                return 200;
                break;
            case '028':
                return 450;
                break;
            case '029':
                return 500;
                break;
            case '030':
                return 500;
                break;
            case '031':
                return 500;
                break;
            case '032':
                return 100;
                break;
            case '033':
                return 300;
                break;
            case '034':
                return 600;
                break;
            case '035':
                return 100;
                break;
            case '036':
                return 300;
                break;
            case '037':
                return 600;
                break;
            case '038':
                return 100;
                break;
            case '039':
                return 200;
                break;
            case '040':
                return 400;
                break;
            case '041':
                return 200;
                break;
            case '042':
                return 600;
                break;
            case '043':
                return 350;
                break;
            case '044':
                return 350;
                break;
            case '045':
                return 0;
                break;
            case '046':
                return 800;
                break;
            case '047':
                return 250;
                break;
            case '048':
                return 550;
                break;
            case '049':
                return 1000;
                break;
            case '050':
                return 1000;
                break;
            case '051':
                return 1000;
                break;
            case '052':
                return 1200;
                break;
            case '053':
                return 1200;
                break;
            case '054':
                return 150;
                break;
            case '055':
                return 200;
                break;
            case '056':
                return 250;
                break;
            case '057':
                return 500;
                break;
        }
    }
})