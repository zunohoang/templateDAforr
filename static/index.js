
$(document).ready(function () {
    $('.serviceColumn').hide(); // Ẩn tất cả các cột service ban đầu
    $('.service-checkbox').change(function () {
        var service = $(this).val(); // Lấy giá trị của checkbox đã thay đổi
        if (this.checked) {
            $('.' + service + 'Column').show(); // Hiển thị cột tương ứng nếu checkbox được chọn
        } else {
            $('.' + service + 'Column').hide(); // Ẩn cột tương ứng nếu checkbox không được chọn
        }
    });
});

let computerData = [];

function loadIP_Search(){
    // Cấu trúc của range_ip:
    // 192.168.1.xxx-192.168.1.yyy
    // xxx: địa chỉ IP bắt đầu
    // yyy: địa chỉ IP kết thúc
    let range_ip = document.getElementById("ipRangeInput").value
    var range = range_ip.split("-");
    var start_ip = range[0];
    var end_ip = range[1];
    var start_ip_arr = start_ip.split(".");
    var end_ip_arr = end_ip.split(".");
    var start_ip_num = parseInt(start_ip_arr[3]);
    var end_ip_num = parseInt(end_ip_arr[3]);
    for(let i=1;i<=3;i++){
        // Đọc file trong data
        fetch(`src/data/40${i}.json`)
            .then(response => response.json())
            .then(data => {
                // Lấy ra danh sách IP từ file json
                var ip_arr = data.ip;
                var _ip_arr = ip_arr.split(".");
                var ip_num = parseInt(_ip_arr[3]);
                // Kiểm tra xem IP có nằm trong range không
                if(ip_num >= start_ip_num && ip_num <= end_ip_num){
                    computerData.push(data);
                }
            });
    }
}

// Hàm hiển thị dữ liệu từ computer_list
function showData(){
    var tableBody = document.getElementById("tableBody");

    computerData.forEach(function (computer) {
        var row = document.createElement("tr");
        row.classList.add("highlight-row");

        row.innerHTML = `
        <td>${computer.status}</td>
        <td>${computer.room}</td>
        <td>${computer.name}</td>
        <td>${computer.ip}</td>
        <td>${computer.id}</td>
    `;

        tableBody.appendChild(row);
    });
}

// Hàm đọc dữ liệu từ ipRangeInput và gọi hàm loadIP_Search
function loadIP(){
    loadIP_Search();
}

function run(){
    loadIP();
    showData();
}