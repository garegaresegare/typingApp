$(function(){
	$("body").on({
		"keydown" : function(e) {
			/* Shiftキー押下時 */
			if (e.key == "Shift") {
				shiftEvent(e);
			}
			/* Ctrlキー押下時 */
			else if (e.key == "Control") {
				ctrlEvent(e);
			}
			else {
				$("#" + e.keyCode).addClass("keyDown");
			}
		},
		"keyup" : function(e) {
			/* Shiftキーアップ時 */
			if (e.key == "Shift") {
				shiftEvent(e);
			}
			/* Ctrlキーアップ時 */
			else if (e.key == "Control") {
				ctrlEvent(e);
			}
			else {
				$("#" + e.keyCode).removeClass("keyDown");
			}
		}
	});
})

/* Shiftキー左右判定関数 */
function shiftEvent(e) {
	if (e.originalEvent.location === 1) {
		$(".shift-left").toggleClass("keyDown");
	} else {
		$(".shift-right").toggleClass("keyDown");
	}
}

/* Ctrlキー左右判定関数 */
function ctrlEvent(e) {
	if (e.originalEvent.location === 1) {
		$(".ctrl-left").toggleClass("keyDown");
	} else {
		$(".ctrl-right").toggleClass("keyDown");
	}
}
