$(function () {

  // 全controlボタンのelementを取得
  const element_button_control = document.getElementsByClassName('status_card_control');

  // 全controlボタンのイベントハンドラを登録する
  for (let item = 0; item < element_button_control.length; item++) {

    element_button_control[item].addEventListener('click', function () {

      // 操作確認用modalウインドウ表示する
      $('#modal_confirm_operation').modal('show');

      // クリックされたcontrolボタンのdeice_nameを取得し、modalウインドウに表示
      document.getElementById("modal_confirm_operation_text").innerText = this.getElementsByTagName('h5')[0].innerText;
      // クリックされたcontrolボタンのdevice_idを取得し、device_id属性に追加
      document.getElementById("modal_confirm_operation_text").setAttribute("data-device_id", this.getAttribute("data-device_id"));
      // クリックされたcontrolボタンのstatusを取得し、status属性に追加
      const status = this.getAttribute("data-status");
      document.getElementById("modal_confirm_operation_text").setAttribute("data-status", status);

      // AC100V ON
      if (status == "1") {
        document.getElementById("modal_confirm_operation_text").innerText += "　→　OFF";
      }
      // AC100V OFF
      else if (status == "0") {
        document.getElementById("modal_confirm_operation_text").innerText += "　→　ON";
      }

    });
  }


});





/**
* サーバへから受信したsensorDBの内容をDOMに展開する
* @param {Object} sensordb : 受信したsensorDBのオブジェクト
*/
function decode_sensordb(sensordb) {

  let temp_element;

  // 全てのcontrol card のelementを取得
  const element_status_card_control = document.getElementsByClassName('status_card_control');

  // DOMに展開していく
  if (sensordb.ac100v1 == 1) {
    element_status_card_control[0].getElementsByTagName('span')[0].innerText = "ON";
    element_status_card_control[0].getElementsByTagName('span')[0].className = "badge badge-success";
    element_status_card_control[0].setAttribute("data-status", "1");
  }
  else {
    element_status_card_control[0].getElementsByTagName('span')[0].innerText = "OFF";
    element_status_card_control[0].getElementsByTagName('span')[0].className = "badge badge-light";
    element_status_card_control[0].setAttribute("data-status", "0");
  }

  if (sensordb.ac100v2 == 1) {
    element_status_card_control[1].getElementsByTagName('span')[0].innerText = "ON"
    element_status_card_control[1].getElementsByTagName('span')[0].className = "badge badge-success"
    element_status_card_control[1].setAttribute("data-status", "1");
  }
  else {
    element_status_card_control[1].getElementsByTagName('span')[0].innerText = "OFF"
    element_status_card_control[1].getElementsByTagName('span')[0].className = "badge badge-light"
    element_status_card_control[1].setAttribute("data-status", "0");
  }

  if (sensordb.ac100v3 == 1) {
    element_status_card_control[2].getElementsByTagName('span')[0].innerText = "ON";
    element_status_card_control[2].getElementsByTagName('span')[0].className = "badge badge-success";
    element_status_card_control[2].setAttribute("data-status", "1");
  }
  else {
    element_status_card_control[2].getElementsByTagName('span')[0].innerText = "OFF";
    element_status_card_control[2].getElementsByTagName('span')[0].className = "badge badge-light";
    element_status_card_control[2].setAttribute("data-status", "0");
  }

  if (sensordb.ac100v4 == 1) {
    element_status_card_control[3].getElementsByTagName('span')[0].innerText = "ON";
    element_status_card_control[3].getElementsByTagName('span')[0].className = "badge badge-success";
    element_status_card_control[3].setAttribute("data-status", "1");
  }
  else {
    element_status_card_control[3].getElementsByTagName('span')[0].innerText = "OFF";
    element_status_card_control[3].getElementsByTagName('span')[0].className = "badge badge-light";
    element_status_card_control[3].setAttribute("data-status", "0");
  }

  if (sensordb.ac100v5 == 1) {
    element_status_card_control[4].getElementsByTagName('span')[0].innerText = "ON";
    element_status_card_control[4].getElementsByTagName('span')[0].className = "badge badge-success";
    element_status_card_control[4].setAttribute("data-status", "1");
  }
  else {
    element_status_card_control[4].getElementsByTagName('span')[0].innerText = "OFF";
    element_status_card_control[4].getElementsByTagName('span')[0].className = "badge badge-light";
    element_status_card_control[4].setAttribute("data-status", "0");
  }

  if (sensordb.ac100v6 == 1) {
    element_status_card_control[5].getElementsByTagName('span')[0].innerText = "ON";
    element_status_card_control[5].getElementsByTagName('span')[0].className = "badge badge-success";
    element_status_card_control[5].setAttribute("data-status", "1");
  }
  else {
    element_status_card_control[5].getElementsByTagName('span')[0].innerText = "OFF";
    element_status_card_control[5].getElementsByTagName('span')[0].className = "badge badge-light";
    element_status_card_control[5].setAttribute("data-status", "0");
  }

  document.getElementById('status_card_watar_temperature').innerText = sensordb.watar_temperature + "℃";
  document.getElementById('status_card_air_temperature').innerText = sensordb.air_temperature + "℃";
  document.getElementById('status_card_air_humidity').innerText = sensordb.air_humidity + "%";
  document.getElementById('status_card_food_level').innerText = sensordb.food_level + "%";


  temp_element = document.getElementById('status_card_status');
  if (sensordb.status == 0) {
    temp_element.innerText = "OK";
    temp_element.className = "badge badge-success";
  }
  else {
    temp_element.innerText = "ALARM";
    temp_element.className = "badge badge-danger";
  }

  temp_element = document.getElementById('status_card_status_sensor_watar');
  if (sensordb.status_sensor_watar == 0) {
    temp_element.innerText = "OK";
    temp_element.className = "badge badge-success";
  }
  else {
    temp_element.innerText = "ALARM";
    temp_element.className = "badge badge-danger";
  }

  temp_element = document.getElementById('status_card_status_sensor_air');
  if (sensordb.status_sensor_air == 0) {
    temp_element.innerText = "OK";
    temp_element.className = "badge badge-success";
  }
  else {
    temp_element.innerText = "ALARM";
    temp_element.className = "badge badge-danger";
  }

}

