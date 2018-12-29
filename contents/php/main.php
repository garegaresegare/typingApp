<?php

require_once 'connectDb.php';
$pdo = connectToDb();

try {
    $sql = "select * from words order by word";
    $stmh = $pdo->prepare($sql);
    $stmh->execute();
} catch (PDOException $Exception) {
    print "エラー:".$Exception->getMessage();
}
$words = $stmh->fetchAll();

?>

<!DOCTYPE html>

<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<link rel="stylesheet" href="../css/mainStyle.css" type="text/css">
<link rel="stylesheet" href="../css/boardStyle.css" type="text/css">
<script type="text/javascript" src="../lib/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="../lib/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="../lib/modernizr.custom.min.js"></script>
<script src="https://rawgit.com/kimmobrunfeldt/progressbar.js/master/dist/progressbar.js"></script>

<script type="text/javascript" src="../js/boardEvent.js"></script>
<script type="text/javascript" src="../js/eventControl.js"></script>
<script type="text/javascript" id="words" src="../js/gameControl.js" data-param='<?php echo json_encode($words); ?>' ></script>
<script type="text/javascript" src="../js/progressBar.js"></script>


<title>タイピングアプリ</title>
</head>
<body>

	<div class="main-area">

		<div class="screen-area">
				<div class="capital-area">スペースキーで開始</div>
				<div id="container_line" class="progress-area"></div>
		</div>
		<div class="information-area">
			<table class="information-table">
				<tr>
					<td>残り時間：</td>
					<td><span class="timeLeft"></span>秒</td>
					<td>連鎖数：</td>
					<td><span class="rensa">0</span>回</td>
					<td>ミス数：</td>
					<td><span class="missType">0</span>回</td>
				</tr>
			</table>
		</div>
		<div class="board-area">
				<ul class="board-parts1 keyboard_dark">
					<li>`</li>
					<li id="49">1</li>
					<li id="50">2</li>
					<li id="51">3</li>
					<li id="52">4</li>
					<li id="53">5</li>
					<li id="54">6</li>
					<li id="55">7</li>
					<li id="56">8</li>
					<li id="57">9</li>
					<li id="48">0</li>
					<li id="189">-</li>
					<li id="222">^</li>
					<li id="220">\</li>
					<li id="8">BS</li>
				</ul>
				<ul class="board-parts2 keyboard_dark">
					<li class="key_tab" id="9">tab</li>
					<li id="81">q</li>
					<li id="87">w</li>
					<li id="69">e</li>
					<li id="82">r</li>
					<li id="84">t</li>
					<li id="89">y</li>
					<li id="85">u</li>
					<li id="73">i</li>
					<li id="79">o</li>
					<li id="80">p</li>
					<li id="192">@</li>
					<li id="219">[</li>
				</ul>

				<ul class="keyboard_dark enter-area">
					<li class="key_enter" id="13">Enter</li>
				</ul>

				<ul class="board-parts3 keyboard_dark">
					<li class="key_caps" id="240">caps</li>
					<li id="65">a</li>
					<li id="83">s</li>
					<li id="68">d</li>
					<li id="70">f</li>
					<li id="71">g</li>
					<li id="72">h</li>
					<li id="74">j</li>
					<li id="75">k</li>
					<li id="76">l</li>
					<li id="187">;</li>
					<li id="186">:</li>
					<li id="221">]</li>
				</ul>

				<ul class="board-parts4 keyboard_dark">
					<li class="key_shift shift-left">shift</li>
					<li id="90">z</li>
					<li id="88">x</li>
					<li id="67">c</li>
					<li id="86">v</li>
					<li id="66">b</li>
					<li id="78">n</li>
					<li id="77">m</li>
					<li id="188">,</li>
					<li id="190">.</li>
					<li id="191">/</li>
					<li id="226">\</li>
					<li class=" key_shift shift-right">shift</li>
				</ul>

				<ul class="board-parts5 keyboard_dark">
					<li class="key_ctrl ctrl-left">ctrl</li>
					<li>Fn</li>
					<li>&nbsp;</li>
					<li id="18">alt</li>
					<li>無変換</li>
					<li class="key_space" id="32">&nbsp;</li>
					<li>変換&nbsp;&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li class="ctrl-right">ctrl</li>
				</ul>

				<ul class="arrows-area keyboard_dark">
					<li class="key_arrows key_arrowUp" id="38">↑</li>
					<li class="key_arrows key_arrowDown" id="40">↓</li>
					<li class="key_arrows key_arrowLeft" id="37">←</li>
					<li class="key_arrows key_arrowRight" id="39">→</li>
				</ul>
		</div>
	</div>
	<div class="modal-area"></div>
</body>
