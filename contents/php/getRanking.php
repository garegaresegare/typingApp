<?php
define("RANKING_RECORD", 5);

$mydata = array();
$ranking = array();
$score = $_POST['score'];


require_once 'connectDb.php';

/* データベース接続 */
$pdo = connectToDb();

try {
    $sql = "select * from (select * from ranking where score >= ".$score." order by rank desc limit ".RANKING_RECORD.") narrowed order by rank asc";
    $stmh = $pdo->prepare($sql);
    $stmh->execute();

    /* sql実行結果を配列へ格納 */
    while ($row = $stmh->fetch(PDO::FETCH_ASSOC)) {
        $ranking[] = $row;
    }

    /* 配列の長さを取得 */
    $count = count($ranking);

    /* $rankingの要素が5つ無かった場合 */
    if ($count != RANKING_RECORD) {
        $sql = getNextSql($count, $ranking);
        $stmh = $pdo->prepare($sql);
        $stmh->execute();

        /* 配列の要素数がRANKING_RECORDと同じになるまで要素追加 */
        addRankingRow($count, $ranking, $stmh);
    }

    /* ランク取得 */
    $mydata["rank"] = getMyRank($count, $score, $ranking);
    /* 呼び出し元に返す配列にランクとランキングを追加 */
    $response = array("myData"=>$mydata,"rankingData"=>$ranking);
} catch (PDOException $Exception) {
    print "エラー:".$Exception->getMessage();
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);

/* sql取得関数 */
function getNextSql($count, $ranking){
    /* $rankingの中身がない場合 */
    if($count == 0) {
        return "select * from ranking where rank >= 1 order by rank limit ".RANKING_RECORD;
    }
    else {
        return "select * from ranking where rank > ".$ranking[$count - 1]["rank"]." order by rank limit ".(RANKING_RECORD - 1);
    }
}

/* ランク取得処理 */
function getMyRank($count, $score, $ranking){
    /* $rankingの中身が無い場合 */
    if ($count == 0) {
        return 1;
    }
    else {
        return $score == $ranking[$count - 1]["score"] ? $ranking[$count - 1]["rank"] : $ranking[$count - 1]["rank"] + 1;
    }
}

/* $ranking要素追加処理 */
function addRankingRow($count, &$ranking, $stmh){
    for ($i = $count; $i < RANKING_RECORD;$i++) {
        array_push($ranking, $stmh->fetch(PDO::FETCH_ASSOC));
    }
    return;
}
?>


