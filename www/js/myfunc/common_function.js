

// グローバル変数
var array_week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var DEBUG_LEVEL = "DEBUG";

//------------------------------------------------------------------------------------------
// 共通 Function-----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

/**
 * sleep関数
 * @param {number} a - 待機時間をミリ秒で指定します。
 */
function myfunc_sleep(a) {
    let dt1 = new Date().getTime();
    let dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}


/**
* 日時を自動で挿入し、コンソールに表示するログを整形して出力する関数
* @param {string} text - コンソールに表示するログテキスト
* @param {string} level - デバックレベル　"INFO" "DEBUG"
*/
function myfunc_consoleLog(text, level) {

    if (level === "DEBUG") {
        //現在時刻を所得
        const now = new Date();
        const Year = now.getFullYear();
        const Month = now.getMonth() + 1;
        const Day = now.getDate();
        const Hour = now.getHours();
        const Min = now.getMinutes();
        const Sec = now.getSeconds();

        console.log(Year + "/" + Month + "/" + Day + " " + Hour + ":" + Min + ":" + Sec + " | " + level + " |" + "\n" + text + "\n");
    }
}


/**
* ステータス表示部の表示を制御
* @param {string} status - ステータス　"online", "wait", "error", "offline"
*/
function myfunc_set_browser_status(status) {

    temp_element = document.getElementById("header_btn_status");

    if (status == "online") {
        temp_element.classList = 'btn btn-success dropdown-toggle';
        temp_element.innerHTML = '<i class="bi bi-check-circle"></i> Online';
        document.getElementById("lockscreen").style.display = 'none';
    }

    else if (status == "wait") {
        temp_element.classList = 'btn btn-info dropdown-toggle';
        temp_element.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Wait';
        document.getElementById("lockscreen").style.display = 'block';
    }

    else if (status == "error") {
        temp_element.classList = 'btn btn-danger dropdown-toggle';
        temp_element.innerHTML = '<i class="bi bi-exclamation-circle"></i> Error';
        document.getElementById("header_datetime_display").innerHTML = '<i class="bi bi-arrow-repeat"></i> Reload';// ヘッダ 時刻表示にReloadを表示
        document.getElementById("lockscreen").style.display = 'block';
    }

    else if (status == "offline") {
        temp_element.classList = 'btn btn-secondary dropdown-toggle';
        temp_element.innerHTML = '<i class="bi bi-x-circle"></i> Offline';
        document.getElementById("header_datetime_display").innerHTML = '<i class="bi bi-arrow-repeat"></i> Reload';// ヘッダ 時刻表示にReloadを表示
        document.getElementById("lockscreen").style.display = 'block';
    }

    else {
        myfunc_consoleLog("myfunc_set_browser_status > unknown status ", DEBUG_LEVEL);
    }

}