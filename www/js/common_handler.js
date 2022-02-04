
$(function () {

  let elements

  //------------------------------------------------------------------------------------------
  // Header 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // LAN接続
  document.getElementById("header_dropdown_selectnetwork_lan").addEventListener('click', function () {

    // Cookieに接続情報を保存
    Cookies.set('connect_type', 'lan', {expires: 30});
    // ページ更新
    location.reload();

  });

  // WAN接続
  document.getElementById("header_dropdown_selectnetwork_wan").addEventListener('click', function () {

    // Cookieに接続情報を保存
    Cookies.set('connect_type', 'wan', {expires: 30});
    // ページ更新
    location.reload();

  });

  // 時刻表示領域押下時、ページをリロードする
  document.getElementById("header_datetime_display").addEventListener('click', function () {
    location.reload();
  });

  // ヘッダのリンクの移動先位置調整
  let headerHight = 60; //ヘッダの高さ
  $('a[href^="#"]').click(function () {
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - headerHight; //ヘッダの高さ分位置をずらす
    $("html, body").animate({ scrollTop: position }, 550, "swing");
    return false;
  });


  // ハンバーガメニューボタン押下時、メニューを表示/非表示
  document.getElementById("header_btn_hamburger").addEventListener('click', function () {
    $("#header_hamburger_menu").slideToggle(300);
  });

  // ハンバーガメニューのリスト押下時、メニューを非表示
  elements = document.getElementsByClassName('header_hamburger_menu_a');
  for (let item = 0; item < elements.length; item++) {
    elements[item].addEventListener("click", function () {
      // 設定変更popupウインドウ表示
      $("#header_hamburger_menu").slideToggle(300);
    })
  }


  //------------------------------------------------------------------------------------------
  // Schedule 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Schedule card 新規作成ボタン　イベントハンドラ
  document.getElementById("button_schedule_new").addEventListener('click', function () {

    // ScheduleのcardのDOM要素をコピーする
    let temp_element = document.getElementById("schedule_copy_template");
    let clone_element = temp_element.cloneNode(true);
    clone_element.id = '';                            // ID重複回避
    clone_element.classList.add('schedule_card');     // Scheduleのcardの親DOMに有効スケジュールであることを示すclassを追加
    clone_element.style.display = "";                 // 画面に表示させる

    // Editボタンのイベントハンドラを登録する
    let element_button_edit = clone_element.getElementsByClassName('button_schedule_edit')[0];
    element_button_edit.addEventListener("click", function () {

      // 親cardのDOMを取得
      let element_card = this.closest('.schedule_card');
      // 親cardのDOMに編集中の目印となるIDをつける（modalウインドウsaveのため）
      element_card.id = 'schedule_editing_by_modal';

      // 親cardのDOMからscheduleに関する情報を読み取り、modalウインドウに表示する
      $('#modal_schedule_settings').modal('show');
      document.getElementById("modal_schedule_name").value = element_card.getElementsByClassName('card_schedule_name')[0].innerText;
      document.getElementById("modal_device_name").innerText = element_card.getElementsByClassName('card_device_name')[0].innerText;
      document.getElementById("modal_schedule_time").value = element_card.getElementsByClassName('card_schedule_time')[0].innerText;
      document.getElementById("modal_job_args").innerText = element_card.getElementsByClassName('card_job_args')[0].innerText;
      const array_week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      for (let day = 0; day < array_week.length; day++) {
        if (element_card.getElementsByClassName('card_schedule_day')[0].children[day].classList.contains('badge-light')) {
          document.getElementById("modal_schedule_day").children[day].className = 'btn badge-light font-weight-bold';
        }
        else {
          document.getElementById("modal_schedule_day").children[day].className = 'btn badge-info font-weight-bold';
        }
      }
    });


    // Deleteボタンのイベントハンドラを登録する
    let element_button_delete = clone_element.getElementsByClassName('button_schedule_delete')[0];
    element_button_delete.addEventListener("click", function () {
      // クリックされたDeleteボタンのcard親DOMを取得し、削除する
      let element_card = this.closest('.schedule_card');
      element_card.remove();
    });

    // ScheduleのcardのDOM要素をhtmlに挿入する
    temp_element.before(clone_element);
    clone_element.animate([{ opacity: '0' }, { opacity: '1' }], 1000)

  });


  //------------------------------------------------------------------------------------------
  // Schedule Modal 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // modalウインドウ 曜日選択ボタン　イベントハンドラを登録
  let element_modal_schedule_day = document.getElementById("modal_schedule_day");
  for (let day = 0; day < array_week.length; day++) {
    // 曜日クリック時に有効(info)と無効(light)を繰り替えるハンドラを登録
    element_modal_schedule_day.children[day].addEventListener('click', function () {
      element_modal_schedule_day.children[day].classList.toggle('badge-light')
      element_modal_schedule_day.children[day].classList.toggle('badge-info')
    });
  }


  // modalウインドウ Operationボタン　イベントハンドラを登録
  let element_modal_dropdown_job_args = document.getElementById("modal_dropdown_job_args").getElementsByClassName("dropdown-item");
  // ON OFF クリック時にドロップダウン選択状態にする
  for (let i = 0; i < element_modal_dropdown_job_args.length; i++) {
    element_modal_dropdown_job_args[i].addEventListener('click', function () {
      document.getElementById("modal_job_args").innerText = this.innerText;
    });
  }


  // modalウインドウ Saveボタン　イベントハンドラを登録
  document.getElementById("modal_button_save").onclick = function () {

    // schedule編集modalの内容を、紐づくschedule card のDOMに反映する
    myfunc_modal_to_card();

    // modalウインドウを非表示にする
    $('#modal_schedule_settings').modal('hide');

    // 設定変更popupウインドウ表示
    $('#fixed_popup_settings').fadeIn()

  };




  //------------------------------------------------------------------------------------------
  // Camera 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Camera Picture/Movie/Livevideo 切り替えselect変更時
  document.getElementById("camera_select_source").onchange = function () {

    // 過去に表示されていたウインドウを未選択状態にする
    temp_elements = document.querySelectorAll('.camera_display_selected');
    temp_elements[0].classList.remove("camera_display_selected");
    temp_elements[0].style.display = "none";
    // 選択したoption valueを取得
    temp_elements = document.getElementById(this.value);
    // valueに紐づくidを持つウインドウを表示し、選択状態classを付与
    temp_elements.style.display = "block";
    temp_elements.classList.add("camera_display_selected");

    // camera操作ボタン表示制御
    // Picture選択時
    if (this.value == "camera_display_picture") {
      document.getElementById("camera_live_startstop").parentElement.style.display = "none";
      document.getElementById("camera_take_picmovie").parentElement.style.display = "block";
      document.getElementById("icon_camera_select_source").innerHTML = '<i class="bi bi-card-image"></i>';
    }
    // Movie選択時
    else if (this.value == "camera_display_movie") {
      document.getElementById("camera_live_startstop").parentElement.style.display = "none";
      document.getElementById("camera_take_picmovie").parentElement.style.display = "block";
      document.getElementById("icon_camera_select_source").innerHTML = '<i class="bi bi-youtube"></i>';
    }
    // Livevideo選択時  
    if (this.value == "camera_display_live") {
      document.getElementById("camera_take_picmovie").parentElement.style.display = "none";
      document.getElementById("camera_live_startstop").parentElement.style.display = "block";
      document.getElementById("icon_camera_select_source").innerHTML = '<i class="bi bi-camera-video"></i>';
    }

  };


  //------------------------------------------------------------------------------------------
  // Settings 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // Settings windows テキスト変更イベント
  elements = document.getElementsByClassName('settings_input');
  // 全inputのイベントハンドラを登録する
  for (let item = 0; item < elements.length; item++) {
    elements[item].addEventListener("change", function () {
      // 設定変更popupウインドウ表示
      $('#fixed_popup_settings').fadeIn();
    })
  }


  // window_settings の Category を変更した時
  document.getElementById("custom_select_settings").onchange = function () {

    // 全てのCategoryの設定画面を非表示にする
    let temp_elements = document.querySelectorAll('.settings_tabcontents');
    for (let item = 0; item < temp_elements.length; item++) {
      temp_elements[item].setAttribute('style', 'display: none');
    }

    // 選択されたCategoryを取得
    let temp_id = document.getElementById("custom_select_settings").value;
    // 選択されたCategoryの設定画面を表示する
    document.getElementById(temp_id).setAttribute('style', 'display: block');

  };



  //------------------------------------------------------------------------------------------
  // ネットワーク 関連-----------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // ネットワーク接続が切断された時、ヘッダのステータスをofflineにする
  window.addEventListener("online", function (e) {

    myfunc_set_browser_status("offline");
    myfunc_consoleLog("Internet connection offline", DEBUG_LEVEL);

  });


});
