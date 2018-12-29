<?php
$myScore = $_POST['myScore'];
$myRank = $_POST['myRank'];
$userId = $_POST['userId'];

require_once 'connectDb.php';

/* データベース接続 */
$pdo = connectToDb();

try {
    /* ランキングに新しいレコードを挿入 */
    $sql = "insert into ranking(rank,user,score)values(:myRank,:userId,:myScore)";
    $stmh = $pdo->prepare($sql);
    $stmh->bindValue(':myRank', $myRank);
    $stmh->bindValue(':myScore', $myScore);
    $stmh->bindValue(':userId', $userId);

    $stmh->execute();
    /* ランキング更新処理 */
    updateRanking($pdo, $myScore);


} catch (PDOException $Exception) {
    print "エラー:".$Exception->getMessage();
}

/* ランキング更新用関数 */
function updateRanking($pdo, $myScore){
    $sql = "update ranking set rank = rank + 1 where score < ".$myScore;
    $stmh = $pdo->prepare($sql);
    $stmh->execute();
}

?>