$(function () {

  // サーバのパラメータ保存用
  var main_parameter = {};
  // cameraのデータベース保存用
  var cameradb = {};
  // hls object
  var hls = new Hls();
  // Websocket オブジェクト
  var ws;


  //------------------------------------------------------------------------------------------
  //画面読み込み時の処理 -------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Cookieに保存されている接続情報を取得し、websocketの接続生成
  const connect_type = Cookies.get('connect_type');
  // LAN接続
  if (connect_type == 'lan') {
    ws = new WebSocket("ws://192.168.1.23:3300");
    document.getElementById("header_dropdown_selectnetwork_lan").classList.add("active");
    document.getElementById("header_dropdown_selectnetwork_wan").classList.remove("active");
  }
  // WAN接続
  else if (connect_type == 'wan') {
    ws = new WebSocket("ws://xxx秘匿xxx:3300");
    document.getElementById("header_dropdown_selectnetwork_lan").classList.remove("active");
    document.getElementById("header_dropdown_selectnetwork_wan").classList.add("active");
  }
  // エラー
  else {
    myfunc_consoleLog("Cookie read error : " + connect_type, DEBUG_LEVEL);
  }

  //------------------------------------------------------------------------------------------
  //Websocket関数　----------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  //Websocket接続確立時のイベントハンドラ
  ws.onopen = function () {

    myfunc_consoleLog("Websocket onopen", DEBUG_LEVEL);

    // 必要な情報一式をサーバに要求する
    websocket_get_alldata();
    // dataview グラフ描写
    dataview_requestdata();

  };

  //error発生時のイベントハンドラ
  ws.onerror = function (e) {
    myfunc_set_browser_status("error");
    myfunc_consoleLog("Websocket onerror", DEBUG_LEVEL);
  };

  //close時のイベントハンドラ
  ws.onclose = function () {
    myfunc_set_browser_status("offline");
    myfunc_consoleLog("Websocket onclose", DEBUG_LEVEL);
  };

  //データ受信時のイベントハンドラ
  ws.onmessage = function (e) {

    //受信したJSON文字列をオブジェクト型に変換する
    const json = JSON.parse(e.data);
    // // オブジェクトをデバック表示
    // myfunc_consoleLog("Websocket recv\ > " + JSON.stringify(json), DEBUG_LEVEL);

    //現在時刻の表示バーを更新
    document.getElementById("header_datetime_display").innerText = json.datetime;

    if (json.messagetype === "ack") {
      myfunc_consoleLog("Websocket recv > messagetype : ack", DEBUG_LEVEL);
      // 必要な情報一式をサーバに要求する
      websocket_get_alldata()
    }

    else if (json.messagetype === "ready") {
      myfunc_consoleLog("Websocket recv > messagetype : ready", DEBUG_LEVEL);
    }

    else if (json.messagetype === "get_parameter") {
      myfunc_consoleLog("Websocket recv > messagetype : get_parameter", DEBUG_LEVEL);

      // argsの中にパラメータファイルが格納されているため取り出す。main_parameterは後でset_parameterで使用する
      main_parameter = json.args;
      myfunc_decode_parameter(main_parameter);

      // サーバの処理終了したため、ブラウザの操作ロックを解除する
      myfunc_set_browser_status("online");
    }

    else if (json.messagetype === "get_sensordb") {
      myfunc_consoleLog("Websocket recv > messagetype : get_sensordb", DEBUG_LEVEL);

      // argsに格納されているsensorDbのデータをDOM要素に展開する
      decode_sensordb(json.args);

      // サーバの処理終了したため、ブラウザの操作ロックを解除する
      myfunc_set_browser_status("online");
    }

    else if (json.messagetype === "get_logdb") {
      myfunc_consoleLog("Websocket recv > messagetype : get_logdb", DEBUG_LEVEL);

      //log表のhtml消去
      $("#tbody_log").html("");
      //log表のhtml追加
      for (let index in json.args.datetimenow) {
        if (json.args.logtype[index] == 'alarm') { logtype_bootstrap = 'danger' } // alarmはdangerに変換する
        else { logtype_bootstrap = json.args.logtype[index] } // infoとwarningはそのまま
        $('<tr>' +
          '<td>' + json.args.datetimenow[index] + '</td>' +
          '<td><span class="badge badge-' + logtype_bootstrap + '">' + json.args.logtype[index] + '</span></td>' +
          '<td>' + json.args.logtext[index] + '</td>' +
          '</tr>').appendTo('#tbody_log');
      }

      // サーバの処理終了したため、ブラウザの操作ロックを解除する
      myfunc_set_browser_status("online");
    }

    else if (json.messagetype === "get_cameradb") {
      myfunc_consoleLog("Websocket recv > messagetype : get_cameradb", DEBUG_LEVEL);
      //cameraDBの中身をグローバル変数に保存する
      cameradb = json;
      // 画像選択paginationの矢印の有効/無効判定
      camera_update_display(cameradb);

      // サーバの処理終了したため、ブラウザの操作ロックを解除する
      myfunc_set_browser_status("online");
    }

    else if (json.messagetype === "get_dataview") {
      myfunc_consoleLog("Websocket recv > messagetype : get_dataview", DEBUG_LEVEL);
      // Plotlyでグラフ描写
      myfunc_dataview_plot(json.args);

      // サーバの処理終了したため、ブラウザの操作ロックを解除する
      myfunc_set_browser_status("online");
    }

    else {
      myfunc_consoleLog("Websocket recv > messagetype : unknown", DEBUG_LEVEL);
      myfunc_consoleLog("Websocket recv > " + JSON.stringify(json), DEBUG_LEVEL);

      // ステータスバーError
      myfunc_set_browser_status("error");
    }
  };



  //------------------------------------------------------------------------------------------
  // Control 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // 操作確認用modalウインドウのOKボタンを押下した時
  document.getElementById("modal_confirm_operation_button_OK").onclick = function () {

    const temp_object = new Object();

    // data属性からdevice_idを所得
    temp_object.device_id = document.getElementById("modal_confirm_operation_text").getAttribute("data-device_id");

    // 現在の制御状態を取得し、操作としては論理反転したものをstatusに格納する
    const temp_status = document.getElementById("modal_confirm_operation_text").getAttribute("data-status");
    if (temp_status == "1") {
      temp_object.operation = 0;
    }
    else if (temp_status == "0") {
      temp_object.operation = 1;
    }

    // サーバにメッセージを送信する、device_idで指定したデバイスの操作要求
    websocket_send_basicmsg(ws, "control", temp_object);

    // modalウインドウを非表示にする
    $('#modal_confirm_operation').modal('hide');

  };


  //------------------------------------------------------------------------------------------
  // Camera 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Next画像 ボタン押下時
  function picmovie_pagination_next() {
    // 現在表示中の画像よりも１枚新しいファイルを参照させる
    let temp_elements = document.getElementById("camera_datetimenow");
    let index = temp_elements.dataset.index;
    temp_elements.dataset.index = index - 1;
    // 画像および動画の表示を更新する
    camera_update_display(cameradb)
  }

  // Previous画像 ボタン押下時
  document.getElementById("camera_pagination_previous").addEventListener('click', picmovie_pagination_previous);
  function picmovie_pagination_previous() {
    // 現在表示中の画像よりも１枚古いファイルを参照させる
    let temp_elements = document.getElementById("camera_datetimenow");
    let index = parseInt(temp_elements.dataset.index);
    temp_elements.dataset.index = index + 1;
    // 画像および動画の表示を更新する
    camera_update_display(cameradb)
  }


  /**
* camera 画像および動画の表示に関する処理を実行
* @param {object} cameradb サーバから受信したcameraDB
*/
  function camera_update_display(cameradb) {

    // 表示中のindexを取得
    let temp_elements = document.getElementById("camera_datetimenow");
    let index = parseInt(temp_elements.dataset.index);

    // 画像選択paginationの矢印の有効/無効判定
    if (index <= 0) {
      index = 0;
      // Nextボタングレーアウト、イベントハンドラも無効
      document.getElementById("camera_pagination_next").classList.add("disabled");
      document.getElementById("camera_pagination_next").removeEventListener('click', picmovie_pagination_next);
    }
    else if (index >= cameradb.length) {
      index = cameradb.length;
      // Previousボタングレーアウト、イベントハンドラも無効
      document.getElementById("camera_pagination_previous").classList.add("disabled");
      document.getElementById("camera_pagination_previous").removeEventListener('click', picmovie_pagination_previous);
    }
    else {
      /// Next・Previousボタンenable、イベントハンドラを登録
      document.getElementById("camera_pagination_next").classList.remove("disabled");
      document.getElementById("camera_pagination_next").addEventListener('click', picmovie_pagination_next);
      document.getElementById("camera_pagination_previous").classList.remove("disabled");
      document.getElementById("camera_pagination_previous").addEventListener('click', picmovie_pagination_previous);
    }

    // cameradbからファイル名(filename)と撮影日時(datetimenow)を参照し、DOMに反映する
    let filename_picture = "/img/picture/" + cameradb.args.filename[index] + ".jpg";
    let filename_movie = "/img/movie/" + cameradb.args.filename[index] + ".mp4";
    document.getElementById("camera_display_source_picture").setAttribute('src', filename_picture);
    document.getElementById("camera_display_source_movie").setAttribute('src', filename_movie);
    document.getElementById("camera_video").load(); //videoタグは再読み込みが必要
    document.getElementById("camera_datetimenow").innerText = cameradb.args.datetimenow[index];

  }

  // Live:start/stopボタン
  document.getElementById("camera_live_startstop").addEventListener('click', function () {

    let elements = document.getElementById("camera_live_startstop");
    // ボタン表示変更
    if (elements.dataset.status == "0") {
      elements.dataset.status = "1"
      elements.innerHTML = '<i class="bi bi-pause-circle"></i>　Stop Live Streaming'
    }
    else {
      elements.dataset.status = "0"
      elements.innerHTML = '<i class="bi bi-play-circle"></i>　Start Live Streaming'
    }

    // サーバにコマンド送信
    const temp_object = new Object();
    temp_object.device_id = "camera_live_startstop";
    temp_object.operation = elements.dataset.status;
    websocket_send_basicmsg(ws, "control", temp_object);

    // live stream開始
    if (elements.dataset.status == "1") {

      // Live video HLS.js
      var video = document.getElementById('camera_live');
      // サーバがあたたまるのを待つ
      myfunc_sleep(8000);
      // hls.jsが必要なブラウザ
      if (Hls.isSupported()) {
        hls.loadSource('/img/live/playlist.m3u8');
        hls.attachMedia(video);
        hls.startLoad();
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          video.muted = true;
          video.play();
        });
      }
      // hls.jsが不要なブラウザ
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = '/img/live/playlist.m3u8';
        video.addEventListener('canplay', function () {
          video.play();
        });
      }
    }
    // live stream停止
    else {
      hls.stopLoad();
    }


  });

  // movie/picture:手動撮影ボタン
  document.getElementById("camera_take_picmovie").addEventListener('click', function () {

    const temp_object = new Object();
    temp_object.device_id = "camera_take_picmovie";
    websocket_send_basicmsg(ws, "control", temp_object);

  });



  //------------------------------------------------------------------------------------------
  // Data View 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Sensor を変更した時
  document.getElementById("dataview_select_sensorname").addEventListener('change', dataview_requestdata);

  // Period を変更した時
  document.getElementById("dataview_select_period").addEventListener('change', dataview_requestdata);

  /**
* 現在選択されているSensorおよびPeriodをサーバに送信し、センサデータを要求する
*/
  function dataview_requestdata() {
    const temp_object = new Object();
    temp_object.sensorname = document.getElementById("dataview_select_sensorname").value;
    temp_object.period = document.getElementById("dataview_select_period").value;
    websocket_send_basicmsg(ws, "get_dataview", temp_object);
  }



  //------------------------------------------------------------------------------------------
  // Log 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // window_Log の show entries を変更した時
  document.getElementById("log_select_showentries").onchange = function () {

    const temp_object = new Object();
    temp_object.entries = document.getElementById("log_select_showentries").value;
    temp_object.filter = document.getElementById("log_select_logtypefilter").value;
    websocket_send_basicmsg(ws, "get_logdb", temp_object);

  };

  // window_Log の filter を変更した時
  document.getElementById("log_select_logtypefilter").onchange = function () {

    const temp_object = new Object();
    temp_object.entries = document.getElementById("log_select_showentries").value;
    temp_object.filter = document.getElementById("log_select_logtypefilter").value;
    websocket_send_basicmsg(ws, "get_logdb", temp_object);

  };



  //------------------------------------------------------------------------------------------
  // 設定変更popup 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Applyボタン
  document.getElementById("button_fixed_popup_settings_apply").onclick = function () {

    // schedule card のDOMから情報を集約し、サーバーに送信するパラメータファイルを生成する。
    const temp_parameter = myfunc_encode_parameter(main_parameter);
    // パラメータファイルをサーバに送信し、サーバ保持のパラメータファイルに上書きさせる。
    websocket_send_basicmsg(ws, "set_parameter", temp_parameter);
    // 設定変更popupウインドウ非表示
    $('#fixed_popup_settings').fadeOut()

  }

  // Cancelボタン
  document.getElementById("button_fixed_popup_settings_cancel").onclick = function () {

    // Webページをリロードする
    location.reload();

  }





  //------------------------------------------------------------------------------------------
  // websocket 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------


  /**
  * 画面更新に必要な情報一式をサーバに要求する
  */
  function websocket_get_alldata() {

    //パラメータファイルをサーバに要求
    websocket_send_basicmsg(ws, "get_parameter");
    //センサ情報をサーバに要求
    websocket_send_basicmsg(ws, "get_sensordb");
    //log情報をサーバに要求
    let temp_object = new Object();
    temp_object.entries = document.getElementById("log_select_showentries").value;
    temp_object.filter = document.getElementById("log_select_logtypefilter").value;
    websocket_send_basicmsg(ws, "get_logdb", temp_object);
    //画像データベースをサーバに要求
    let tempObj_camera = new Object();
    tempObj_camera.entries = 20;
    websocket_send_basicmsg(ws, "get_cameradb", tempObj_camera);
  }


  /**
  * サーバへ基本形式のwebsocketメッセージ送信
  * @param {object} ws websocketのオブジェクト
  * @param {string} messagetype メッセージタイプ
  * @param {string} args メッセージタイプに紐づく引数を格納
  */
  function websocket_send_basicmsg(ws, messagetype, args) {

    //オブジェクトををJSON文字列に変換
    let sendJson = {};
    sendJson.messagetype = messagetype
    sendJson.args = args
    sendJsonStr = JSON.stringify(sendJson);

    // readyを受信するまで ブラウザ操作ロック
    myfunc_set_browser_status("wait");

    //JSON文字列送信
    ws.send(sendJsonStr);
    myfunc_consoleLog("Websocket send > " + sendJsonStr, DEBUG_LEVEL);
  }

});