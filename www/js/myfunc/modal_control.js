

/**
* schedule編集modalの内容を、紐づくcardのDOMに反映する
*/
function myfunc_modal_to_card() {

    // 編集中のcardのDOMを取得する
    let element_card = document.getElementById('schedule_editing_by_modal');
    // 編集中の目印となるIDを削除する
    element_card.id = '';

    // cardのDOMにmodalウインドウの内容を転記する。
    // schedule_name
    element_card.getElementsByClassName('card_schedule_name')[0].innerText = document.getElementById('modal_schedule_name').value;
    // device_name
    element_card.getElementsByClassName('card_device_name')[0].innerText = document.getElementById('modal_device_name').innerText;
    // device_id
    element_card.getElementsByClassName('card_device_name')[0].setAttribute("data-id", document.getElementById('modal_device_name').getAttribute("data-id"));
    // chedule_time
    element_card.getElementsByClassName('card_schedule_time')[0].innerText = document.getElementById('modal_schedule_time').value;
    // job_args
    element_card.getElementsByClassName('card_job_args')[0].innerText = document.getElementById('modal_job_args').innerText;
    // schedule_day  
    for (let day = 0; day < array_week.length; day++) {
        if (document.getElementById("modal_schedule_day").children[day].classList.contains('badge-light')) {
            element_card.getElementsByClassName('card_schedule_day')[0].children[day].className = 'badge badge-light';
        }
        else {
            element_card.getElementsByClassName('card_schedule_day')[0].children[day].className = 'badge badge-info';
        }
    }

}