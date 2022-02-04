

/**
* サーバから受信したパラメータファイル内容をDOMに展開する
* @param {Object} parameter - parameter : パラメータファイルのオブジェクト
*/
function myfunc_decode_parameter(parameter) {

    let temp_element;

    // --------------------------------------------------
    // Schedule
    // --------------------------------------------------

    // ScheduleのcardのDOMをクリアする
    temp_element = document.getElementsByClassName("schedule_card");
    while (temp_element.length) {
        temp_element[0].remove();
    }

    // ScheduleのcardのDOM要素をコピーする
    temp_element = document.getElementById("schedule_copy_template");
    // コピーしたScheduleのカードのDOM要素をhtmlに挿入
    for (let item in parameter.schedule) {
        let clone_element = temp_element.cloneNode(true);
        // コピーしたScheduleのカードのDOM要素編集する
        clone_element.id = '';                            // ID重複回避
        clone_element.classList.add('schedule_card');     // Scheduleのcardの親DOMに有効スケジュールであることを示すclassを追加
        clone_element.style.display = "";                 // 画面に表示させる
        temp_element.before(clone_element);
    }

    // 複製した全cardのDOM要素を取得する
    let element_card_schedule_name = document.getElementsByClassName("card_schedule_name");
    let element_card_device_name = document.getElementsByClassName("card_device_name");
    let element_card_schedule_time = document.getElementsByClassName("card_schedule_time");
    let element_card_job_args = document.getElementsByClassName("card_job_args");
    let element_card_schedule_day = document.getElementsByClassName("card_schedule_day");

    // 受信したparameterの内容を、window_scheduleのcard要素に展開する
    for (let item in parameter.schedule) {

        //イベント名 < パラメータ.schedule_name
        element_card_schedule_name[item].innerText = parameter.schedule[item].schedule_name;

        //デバイス名 < パラメータ.device_id_name
        tempkey = parameter.schedule[item].device_id;
        //device_id をdata-id属性に追加
        element_card_device_name[item].setAttribute("data-id", tempkey)
        //device_idに紐付けられているdevice_nameをinnerTextに追加
        element_card_device_name[item].innerText = parameter.device_id_name[tempkey];

        //時刻 < パラメータ.schedule_time
        element_card_schedule_time[item].innerText = parameter.schedule[item].schedule_time;

        //実行引数 < パラメータ.job_args
        element_card_job_args[item].innerText = parameter.schedule[item].job_args;

        //実行曜日 < パラメータ.schedule_day
        for (let i = 0; i < array_week.length; i++) {
            if (parameter.schedule[item].schedule_day.includes(array_week[i])) {
                element_card_schedule_day[item].children[i].className = "badge badge-info";
            }
            else {
                element_card_schedule_day[item].children[i].className = "badge badge-light";
            }
        }
    }

    // 受信したparameterの内容を、window_controlのcard要素に展開する　
    const element_status_card_control = document.getElementsByClassName('status_card_control');
    element_status_card_control[0].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.ac100v_no1;
    element_status_card_control[1].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.ac100v_no2;
    element_status_card_control[2].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.ac100v_no3;
    element_status_card_control[3].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.ac100v_no4;
    element_status_card_control[4].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.ac100v_no5;
    element_status_card_control[5].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.ac100v_no6;
    element_status_card_control[6].getElementsByClassName('card-title')[0].innerText = parameter.device_id_name.feeder_no1;
    



    // 受信したparameterの内容をscheduleのmodalウインドウに展開する

    // modalウインドウ デバイス名称プルダウン　
    document.getElementById('modal_dropdown_device_name').innerHTML = ''; // ドロップダウン初期化
    let array_key = Object.keys(parameter.device_id_name);
    for (let i = 0; i < array_key.length; i++) {

        // parameter.device_id_nameの全項目をelement化し、modalデバイス名称プルダウンに追加する
        let temp_dom = document.createElement('div');
        temp_dom.className = 'dropdown-item';
        temp_dom.setAttribute('data-id', array_key[i]); //data属性にdevice_idを付与する
        temp_dom.innerText = parameter.device_id_name[array_key[i]];
        document.getElementById('modal_dropdown_device_name').appendChild(temp_dom);
    }
    // 追加されたデバイス名称プルダウンに、イベントハンドラを作成する
    let element_modal_dropdown_device_name = document.getElementById("modal_dropdown_device_name").getElementsByClassName('dropdown-item');
    for (let i = 0; i < element_modal_dropdown_device_name.length; i++) {

        // プルダウンで選択した項目を反映
        element_modal_dropdown_device_name[i].addEventListener('click', function () {
            // innerTextにデバイス名称を設定
            document.getElementById("modal_device_name").innerText = this.innerText
            // data属性にdevice_idを設定
            document.getElementById("modal_device_name").setAttribute('data-id', this.getAttribute('data-id'));
        });
    }


    // 全てのEditボタンのelementを取得
    let element_button_edit = document.getElementsByClassName('button_schedule_edit');

    for (let item = 0; item < element_button_edit.length; item++) {

        // 全てのEditボタンにユニーク番号(属性:data)をつける
        element_button_edit[item].setAttribute("data", item);

        // 全cardのEditボタンのイベントハンドラを登録する
        element_button_edit[item].addEventListener("click", function () {

            // クリックされたEditボタンのユニーク番号を取得
            let card_id = this.getAttribute("data")
            // console.log("Edit button data : " + card_id);
            // ユニーク番号に紐づく親cardのDOMを取得
            let element_card = this.closest('.schedule_card');
            // 親cardのDOMに編集中の目印となるIDをつける（modalウインドウsaveのため）
            element_card.id = 'schedule_editing_by_modal';

            // 親cardのDOMのdata属性にユニーク番号を付与
            document.getElementById("modal_schedule_settings").setAttribute("data", card_id);

            // 親cardのDOMからscheduleに関する情報を読み取り、modalウインドウに表示する
            $('#modal_schedule_settings').modal('show');
            document.getElementById("modal_schedule_name").value = element_card.getElementsByClassName('card_schedule_name')[0].innerText;
            document.getElementById("modal_device_name").innerText = element_card.getElementsByClassName('card_device_name')[0].innerText;
            document.getElementById("modal_device_name").setAttribute("data-id", element_card.getElementsByClassName('card_device_name')[0].getAttribute("data-id"))
            document.getElementById("modal_schedule_time").value = element_card.getElementsByClassName('card_schedule_time')[0].innerText;
            document.getElementById("modal_job_args").innerText = element_card.getElementsByClassName('card_job_args')[0].innerText;
            for (let day = 0; day < array_week.length; day++) {
                if (element_card.getElementsByClassName('card_schedule_day')[0].children[day].classList.contains('badge-light')) {
                    document.getElementById("modal_schedule_day").children[day].className = 'btn badge-light font-weight-bold';
                }
                else {
                    document.getElementById("modal_schedule_day").children[day].className = 'btn badge-info font-weight-bold';
                }
            }
        });
    }

    // 全てのDeleteボタンのelementを取得
    let element_button_delete = document.getElementsByClassName('button_schedule_delete');

    for (let item = 0; item < element_button_delete.length; item++) {

        // 全cardのDeleteボタンのイベントハンドラを登録する
        element_button_delete[item].addEventListener("click", function () {

            // クリックされたDeleteボタンのcard親DOMを取得し、削除する
            let element_card = this.closest('.schedule_card');
            element_card.remove();

            // 設定変更popupウインドウ表示
            $('#fixed_popup_settings').fadeIn()

        });
    }


    // --------------------------------------------------
    // Control
    // --------------------------------------------------
    $("#solenoid_on_count").val(parameter.control.feeding.solenoid_on_count);
    $("#solenoid_on_time").val(parameter.control.feeding.solenoid_on_time);
    $("#solenoid_on_intervaltime").val(parameter.control.feeding.solenoid_on_intervaltime);
    $("#update_sensordb_interval").val(parameter.control.update_sensordb_interval);

    $("#slide_threshold_coolfan").slider({
        id: "slider_coolfan", min: 10, max: 40, value: parameter.control.coolfan_threshould, focus: true, tooltip: 'always'
    });
    $("#slide_threshold_heater").slider({
        id: "slider_heater", min: 10, max: 40, value: parameter.control.heater_threshould, focus: true, tooltip: 'always'
    });
    const lower = parseInt(parameter.monitor.alarm_watar_temperature.lower);
    const upper = parseInt(parameter.monitor.alarm_watar_temperature.upper);
    $('#alarm_water_temperture').slider({
        id: "slider_alarm", min: 10, max: 40, range: true, value: [lower, upper], focus: true, tooltip: 'always', tooltip_split: true
    });

    // --------------------------------------------------
    // Camera
    // --------------------------------------------------
    document.getElementById("record_movie_time").value = parameter.camera.record_movie_time;
    document.getElementById("picture_f").value = parameter.camera.picture_f;
    document.getElementById("livestream_maxtime").value = parameter.camera.livestream_maxtime;


    // --------------------------------------------------
    // Device name
    // --------------------------------------------------
    document.getElementById("ac100v_no1").value = parameter.device_id_name.ac100v_no1;
    document.getElementById("ac100v_no2").value = parameter.device_id_name.ac100v_no2;
    document.getElementById("ac100v_no3").value = parameter.device_id_name.ac100v_no3;
    document.getElementById("ac100v_no4").value = parameter.device_id_name.ac100v_no4;
    document.getElementById("ac100v_no5").value = parameter.device_id_name.ac100v_no5;
    document.getElementById("ac100v_no6").value = parameter.device_id_name.ac100v_no6;
    document.getElementById("feeder_no1").value = parameter.device_id_name.feeder_no1;
    document.getElementById("picmovie_no1").value = parameter.device_id_name.picmovie_no1;




    // --------------------------------------------------
    // Other
    // --------------------------------------------------
    document.getElementById("mailaddress").value = parameter.other.mailaddress;
    document.getElementById("watar_temperature_compensation").value = parameter.other.watar_temperature_compensation;
    document.getElementById("air_temperature_compensation").value = parameter.other.air_temperature_compensation;
    document.getElementById("air_humidity_compensation").value = parameter.other.air_humidity_compensation;





    // // --------------------------------------------------
    // // ここからSchedule2
    // // --------------------------------------------------

    // // Schedule2のcardのDOMをクリアする
    // temp_element = document.getElementsByClassName("schedule2_card");
    // while (temp_element.length) {
    //     temp_element[0].remove();
    // }

    // // Schedule2の項目数だけ、schedule2 cardのDOM要素を複製し、内容を展開する
    // temp_element = document.getElementById("schedule2_copy_template"); //コピー元テンプレDOM
    // for (let item in parameter.schedule2) {
    //     // テンプレhtmlからクローン生成
    //     let clone_element = temp_element.cloneNode(true);
    //     // クローンにscheduleの情報を展開していく
    //     clone_element.classList.add('schedule2_card');    // class付与
    //     clone_element.id = '';                            // ID重複回避
    //     clone_element.style.display = '';                 // display noneを解除
    //     clone_element.getElementsByClassName("schedule2_btn_edit")[0].setAttribute("data-num", item) // 連番をdata-num属性に付与


    //     // device_id
    //     let devicename = parameter.schedule2[item].device_id;
    //     clone_element.getElementsByClassName("schedule2_card_device_id")[0].innerText = devicename;

    //     // device_name
        
    //     clone_element.getElementsByClassName("schedule2_device_name")[0].innerText = parameter['device_id_name'][devicename];

    //     // enable

    //     // schedule_day
    //     let schedule_day_badge = clone_element.getElementsByClassName("schedule_day_badge");
    //     tempstr = parameter.schedule2[item].schedule_day; // "1111111" "日月火水木金土"
    //     for (let i = 0; i < 7; i++) {
    //         // 左から１文字づつ切り出し、"1"は有効日、"0"は無効日
    //         if (tempstr.substr(i, 1) == "1") {
    //             schedule_day_badge[i].className = "badge badge-info schedule_day_badge"
    //         }
    //         else {
    //             schedule_day_badge[i].className = "badge badge-light schedule_day_badge"
    //         }
    //     }

    //     // datetime & job 
    //     // table生成




    //     // Editボタンのイベントハンドラ生成
    //     clone_element.getElementsByClassName('schedule2_btn_edit')[0].addEventListener('click', function () {
    //         $('#modal_schedule2_settings').modal('show');
    //         // let datanum = 
    //         console.log(item);
    //     });




    //     temp_element.before(clone_element);               // htmlに挿入
    // }


}








/**
 * @brief DOMから情報を集約し、サーバーに送信するパラメータファイルのオブジェクトを生成する。
 * @param main_parameter 一時保存しておいたパラメータファイルのオブジェクト
 * @return 更新したパラメータファイルのオブジェクト
 */
function myfunc_encode_parameter(main_parameter) {

    // --------------------------------------------------
    // schedule
    // --------------------------------------------------

    // 全てのschedule cardのelementを取得
    const element_schedule_card = document.getElementsByClassName('schedule_card');
    // パラメータのscheduleをクリアし、schedule cardの数だけ配列要素を用意する
    main_parameter.schedule = new Array(element_schedule_card.length);

    for (let item = 0; item < element_schedule_card.length; item++) {

        main_parameter.schedule[item] = {};
        main_parameter.schedule[item].schedule_name = element_schedule_card[item].getElementsByClassName('card_schedule_name')[0].innerText;
        main_parameter.schedule[item].device_id = element_schedule_card[item].getElementsByClassName('card_device_name')[0].getAttribute("data-id");
        main_parameter.schedule[item].schedule_time = element_schedule_card[item].getElementsByClassName('card_schedule_time')[0].innerText;
        main_parameter.schedule[item].job_args = element_schedule_card[item].getElementsByClassName('card_job_args')[0].innerText;

        const temp_element = element_schedule_card[item].getElementsByClassName('card_schedule_day')[0];
        let temp_array = [];
        for (let day = 0; day < array_week.length; day++) {
            if (temp_element.children[day].classList.contains('badge-info')) {
                temp_array.push(array_week[day]);
            }
        }
        main_parameter.schedule[item].schedule_day = temp_array;
    }


    // --------------------------------------------------
    // control
    // --------------------------------------------------
    main_parameter.control.coolfan_threshould = parseFloat(document.getElementById("slide_threshold_coolfan").value);
    main_parameter.control.heater_threshould = parseFloat(document.getElementById("slide_threshold_heater").value);
    main_parameter.control.update_sensordb_interval = parseInt(document.getElementById("update_sensordb_interval").value);
    main_parameter.control.feeding.solenoid_on_count = parseInt(document.getElementById("solenoid_on_count").value);
    main_parameter.control.feeding.solenoid_on_time = parseFloat(document.getElementById("solenoid_on_time").value);
    main_parameter.control.feeding.solenoid_on_intervaltime = parseFloat(document.getElementById("solenoid_on_intervaltime").value);
    const temp = document.getElementById("alarm_water_temperture").value; //カンマ区切りで取得される [lower,upper]
    main_parameter.monitor.alarm_watar_temperature.lower = parseInt(temp.split(',')[0]);
    main_parameter.monitor.alarm_watar_temperature.upper = parseInt(temp.split(',')[1]);


    // --------------------------------------------------
    // camera
    // --------------------------------------------------
    main_parameter.camera.record_movie_time = parseFloat(document.getElementById("record_movie_time").value);
    main_parameter.camera.picture_f = parseFloat(document.getElementById("picture_f").value);
    main_parameter.camera.livestream_maxtime = parseFloat(document.getElementById("livestream_maxtime").value);



    // --------------------------------------------------
    // device_id_name
    // --------------------------------------------------
    main_parameter.device_id_name.ac100v_no1 = document.getElementById("ac100v_no1").value;
    main_parameter.device_id_name.ac100v_no2 = document.getElementById("ac100v_no2").value;
    main_parameter.device_id_name.ac100v_no3 = document.getElementById("ac100v_no3").value;
    main_parameter.device_id_name.ac100v_no4 = document.getElementById("ac100v_no4").value;
    main_parameter.device_id_name.ac100v_no5 = document.getElementById("ac100v_no5").value;
    main_parameter.device_id_name.ac100v_no6 = document.getElementById("ac100v_no6").value;
    main_parameter.device_id_name.feeder_no1 = document.getElementById("feeder_no1").value;
    main_parameter.device_id_name.picmovie_no1 = document.getElementById("picmovie_no1").value;



    // --------------------------------------------------
    // other
    // --------------------------------------------------
    main_parameter.other.mailaddress = document.getElementById("mailaddress").value;
    main_parameter.other.watar_temperature_compensation = parseFloat(document.getElementById("watar_temperature_compensation").value);
    main_parameter.other.air_temperature_compensation = parseFloat(document.getElementById("air_temperature_compensation").value);
    main_parameter.other.air_humidity_compensation = parseFloat(document.getElementById("air_humidity_compensation").value);



    return main_parameter;

}