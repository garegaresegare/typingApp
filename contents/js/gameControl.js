var KEY_SPACE = 32
var TIMER = 5
var RANKING_RECORDS = 5
var COUNT_START = 3
var TIME_FINISH = 0
var FLASH_INTERVAL = 700
var OFFSET_TOP = 75
var ERR_MSG = "ランキングに登録するユーザー名を入力してください"
var ERR_MSG_LINE_HEIGHT = 18.4
var ERR_MSG_MAX_WIDTH = 300
var ERR_MSG_MAX_LENGTH = 20
var USER_NAME_MAX_LENGTH = 7
var SCORE_RATE = 100
var json = JSON.parse($("#words").attr("data-param"))

/* 初期設定関数 */
$(function setInitial() {
    var timer = TIMER
	var playingFlg = false;
    var $objTimer=$(".timeLeft")
    var $capArea = $(".capital-area")

	/* タイマーセット */
	$objTimer.text(timer)

	/* プログレスバー表示 */
	progressLine()

	/* 「スペースキーで開始」点滅 */
	var pressSpaceId = setInterval(function(){$capArea.fadeOut(FLASH_INTERVAL,function(){$(this).fadeIn(FLASH_INTERVAL)})},FLASH_INTERVAL * 2)

    $("body").on("keydown",function(e) {
		/* スペースキーが押されたら開始 */
		if (e.keyCode == KEY_SPACE) {
			if(!playingFlg){
				playingFlg = true;
				$capArea.stop().css("opacity","1")
				clearInterval(pressSpaceId)
				/* カウントダウン開始 */
				startCountDown(timer,$objTimer,$capArea)
			}
		}
	})

	/* 「ゲームをやめる」ボタン押下時 */
	$(document).on("click","[name='quit']",function(){
		window.open("about:blank","_self").close()
	})

	/* 「ランキングに登録する」ボタン押下時 */
	$(document).on("click","[name='update']",function(){
		if ($(this).val() == "ランキングに登録する") {
			makeUserInputArea()
			$(this).val("登録する")
		}
		else {
			if (checkUserName("#userId")) {
				updateRanking()
				$(this).val("登録済").prop("disabled",true)
				$("#userId").remove()
			}
			else {
				showErrorMessage("#userId",ERR_MSG)
			}
		}
	})

	/* 「もう一度遊ぶ」ボタン押下時 */
	$(document).on("click","[name='again']",function(){
		window.location.reload()
	})
})

/* タイピング開始関数 */
function startType(timer, $objTimer){
	var	souType=0
	var missType=0
	var correctType=0
	var renzokuType=0
	var renzokuMaxType=0
	var capitalIndex=0
	var $objRensa=$(".rensa")
	var $objMiss=$(".missType")
	/* 制限時間の表示処理 */
	var timerId = setInterval(function(){
					timer--
					$objTimer.text(timer)
					/* 制限時間終了時 */
					if (timer == TIME_FINISH){
						/* キーボードイベントを無効化 */
						$("body").off("keydown")
						/* ランキングの取得 */
						getRanking(souType, renzokuMaxType, renzokuType, missType, correctType,loopId)
						clearInterval(timerId)
					}
					},1000)

	/* 単語をループで表示させる */
	var loopId = wordsDisp()

	/* 入力処理 */
	$("body").on("keydown",function(e) {
		souType++
		$objTargetChar = $(".capital-area span:nth-child(" + (capitalIndex + 1) + ")")
		 /* 入力待ち文字と入力文字が正しかったとき */
		if (e.key == $objTargetChar.text()) {
			$objTargetChar.css("color", "yellow")
			correctType++
			capitalIndex++
			renzokuType++
			$objRensa.text(renzokuType)

			 /* 表示文字列の入力が終了したとき */
			if (capitalIndex === $(".capital-area span").length) {
				clearInterval(loopId)
				loopId = wordsDisp()
			}
		} else {
			/* 最大連鎖数更新 */
			if (renzokuMaxType < renzokuType) {
				renzokuMaxType = renzokuType
			}
			missType++;
			renzokuType=0;
			$objRensa.text(renzokuType)
			$objMiss.text(missType)
		}
	})

	/* 単語のループ表示 */
	function wordsDisp(){
		loopDisp()
		return setInterval(loopDisp, 3000)
	}

	/* 表示処理関数 */
	function loopDisp() {
		var randomNum = Math.floor(Math.random() * (json.length))
		var str = json[randomNum].word;
		var word = str.split("")

		/* 入力待ち文字のインデックスをクリア */
		capitalIndex = 0
		/* スクリーンをクリア */
		clearScreen()

		/* 文字列を表示 */
		$.each(word, function(index, value) {
			$(".capital-area").append(
					"<span>" + value + "</span>")
		})

		var line = progressLine()
		progressStart(line)
	}
}

/* 終了モーダル表示 */
function dispModal(loopId){
	/* 文字列ループ表示を終了 */
	clearInterval(loopId)
	/* スクリーンの表示をクリア */
	clearScreen()
	$(".modal-area").fadeIn("slow")
	$(".contents-area").fadeIn("slow")
}

/* スクリーンの表示をクリアにする */
function clearScreen(){
	$(".capital-area").html("")
	$(".progress-area").html("")
}

/* 結果表示用のモーダルのテーブルを作成する */
function makeResultTable(souType, renzokuMaxType, missType, correctType, score, rank){

	var average = souType / TIMER
	var	correctPer = correctType == 0 ? "-" : (correctType / souType * 100).toFixed(2)

	var htmlResult =	'<div class="contents-area">' +
							'<table class="result-table">' +
								'<tr>' +
									'<td>タイプ総数</td>'　+
									'<td><span>' + souType + '</span>&nbsp;打</td>' +
									'<td rowspan=7>' +
										'<table class="ranking-table">' +
											'<tr>' +
												'<th colspan="3" style="font-size:24px;">ランキング<th>' +
											'</tr>' +
										'</table>' +
									'</td>'+
								'</tr>' +
								'<tr>' +
									'<td>ミ　ス　数</td>'  +
									'<td><span>' + missType + '</span>&nbsp;回</td>' +
								'</tr>' +
								'<tr>' +
									'<td>最大連鎖数</td>' +
									'<td><span>' + renzokuMaxType + '</span>&nbsp;回</td>' +
								'</tr>' +
								'<tr>' +
									'<td>正　打　率</td>' +
									'<td><span>' + correctPer + '</span>&nbsp;%</td>' +
								'</tr>' +
								'<tr>' +
									'<td>平均入力文字数</td>' +
									'<td><span>' + average.toFixed(2) + '</span>&nbsp;/sec</td>' +
								'</tr>' +
								'<tr>' +
									'<td>ス　コ　ア</td>' +
									'<td><span class="myScore">'+ score +'</span>点</td>' +
								'</tr>' +
								'<tr>' +
								'<td>　順　位　</td>' +
								'<td><span class="myRank">'+ rank +'</span>位</td>' +
							'</tr>' +
							'</table>' +
							'<div class="button-area">' +
								'<input type="button" class="modal_footer_left" name="quit" value="ゲームをやめる"/>' +
								'<input type="button" class="modal_footer_right" name="again" value="もう一度遊ぶ"/>' +
								'<div class="modal_footer_middle"><input type="button" name="update" value="ランキングに登録する"></div>' +
							'</div>'+
						'</div>';

	$(".modal-area").append(htmlResult)
}

/* ランキングテーブル作成 */
function makeRankingTable(rankingData){
	for (var i = 0;i < RANKING_RECORDS; i++) {
		var htmlRanking = 	'<tr>' +
								'<td><span>' + rankingData[i]["rank"] + '</span> 位</td>' +
								'<td><span>' + rankingData[i]["user"]+ '</span> さん</td>' +
								'<td><span>' + rankingData[i]["score"] + '</span> 点</td>' +
							'</tr>'
		$(".ranking-table").append(htmlRanking)
	}
}

/* ランキングを取得する関数 */
function getRanking(souType, renzokuMaxType, renzokuType, missType, correctType,loopId){
	renzokuMaxType = renzokuMaxType == 0 ? renzokuType : renzokuMaxType
	var score = calculateScore(renzokuMaxType, missType, correctType)
	$.ajax({
		type:"POST",
		url:"getRanking.php",
		data:{
			"score":score
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log("通信失敗")
			console.log("XMLHttpRequest:" + XMLHttpRequest.status)
			console.log("textStatus:" + textStatus)
			console.log("errorThrown:" + errorThrown.message)
		},
		success:function(response){
			console.log("通信成功")
			/* 結果テーブルの作成 */
			makeResultTable(souType, renzokuMaxType, missType, correctType, score,response["myData"]["rank"])
			/* ランキングテーブルの作成 */
			makeRankingTable(response["rankingData"])
			dispModal(loopId)
		}
	})
}


/* スコア計算関数 */
function calculateScore(renzokuMaxType, missType, correctType){
	return (correctType + renzokuMaxType - missType) * SCORE_RATE
}


/* ユーザー名入力欄表示関数 */
function makeUserInputArea(){
	var userInputHtml = "<input type='text'id='userId' placeholder='登録ユーザー名'style='width:150px; height:20px;'/>"
	$(".modal_footer_middle").prepend(userInputHtml)
}

/* ユーザー名チェック関数 */
function checkUserName(sel){
	var checkTarget = $(sel).val().replace(/\s+|　/g,"")
	/* 入力が7文字より多いもしくは空白の場合 */
	if (checkTarget.length > USER_NAME_MAX_LENGTH || checkTarget == "") {
		return false
	}
	return true
}

/* ランキング更新関数 */
function updateRanking(){
	var myScore = $(".myScore").text()
	var myRank = $(".myRank").text()
	var userId = $("#userId").val()

	$.ajax({
		type:"POST",
		url:"insertRecord.php",
		data:{
			"myScore":myScore,
			"myRank":myRank,
			"userId":userId
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log("通信失敗")
			console.log("XMLHttpRequest:" + XMLHttpRequest.status)
			console.log("textStatus:" + textStatus)
			console.log("errorThrown:" + errorThrown.message)
		},
		success:function(){
			console.log("通信成功")
			insertToRanking(myScore, myRank,userId)
		}
	})

}

/* エラーメッセージ表示関数 */
function showErrorMessage(sel, message){
	clearErrorMessage()
	$(sel).after(makeErrorMessage(message))
	var position = $(sel).offset()
	var messageRow = Math.floor(message.length/ERR_MSG_MAX_LENGTH) + 1

	$(".errmsg").css({
		top:position.top - OFFSET_TOP - ERR_MSG_LINE_HEIGHT * messageRow,
		left:position.left,
		width:messageRow != 1 ? ERR_MSG_MAX_WIDTH : message.length * ERR_MSG_MAX_LENGTH
	})
	$(".errmsg").show()
}

/* エラーメッセージ作成関数 */
function makeErrorMessage(message){
	return "<p class='errmsg'>" + message + "</p>"
}

/* エラーメッセージ削除関数 */
function clearErrorMessage(){
	$(".errmsg").remove()
}

/* ランキングテーブル更新(挿入)関数 */
function insertToRanking(myScore, myRank,userId){
	clearErrorMessage()
	var $target = $(".ranking-table td:first-child span")
	var innerHtml = '<tr style="backgroud-color:yellow;">' +
						'<td><span>' + myRank + '</span> 位</td>' +
						'<td><span style="color:red;">' + userId + '</span> さん</td>' +
						'<td><span>' + myScore + '</span> 点</td>' +
					'</tr>'
	/* 結果が1～5位以内のとき */
	if($target.eq(myRank - 1).text() == myRank) {
		for (var i = myRank - 1;i < RANKING_RECORDS;i++) {
			if($(".ranking-table td:nth-child(3) span").eq(i).text() != myScore){
				$target.eq(i).text(Number($target.eq(i).text()) + 1)
			}
		}
		$target.eq(myRank - 1).closest("tr").before(innerHtml)
		$(".ranking-table tr:last-child").remove()
	}
	else {
		$(".ranking-table tr:last-child").after(innerHtml)
		$(".ranking-table tr:nth-child(2)").remove()
	}


}

/* カウントダウン関数 */
function startCountDown(timer,$objTimer,$sel){

	var countStart = COUNT_START

	dispCount(countStart, $sel)
	var countDownId = setInterval(function(){
			dispCount(countStart - 1, $sel)
			countStart--
			/* カウントダウン終了時、タイピング開始 */
			if (countStart == TIME_FINISH){
				clearInterval(countDownId)
				startType(timer,$objTimer)
			}
		},1000)
}

/* カウント表示関数 */
function dispCount(countStart, $sel){
	clearScreen()
	$sel.html('<span style="font-size:60px;">' + countStart + '</span>')
}
