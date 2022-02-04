$(function () {

  // 全controlボタンのelementを取得
  const element_settings_navtab = document.getElementsByClassName('settings_navtab');

  // 全controlボタンのイベントハンドラを登録する
  for (let item = 0; item < element_settings_navtab.length; item++) {

    element_settings_navtab[item].addEventListener('click', function () {

      // クリックされた以外のタブのactiveを削除する
      const temp_element = document.getElementsByClassName('settings_navtab');
      for (let i = 0; i < temp_element.length; i++) {
        temp_element[i].classList.remove("active");
      }
      // クリックされたタブのみactiveを追加する
      temp_element[item].classList.add("active");

      // クリックされたタブの設定画面のみ表示する


    });
  }


});




