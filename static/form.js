var data_arr = [];

let osData = {};
let ramData = {};
let diskData = {};

async function run() {
    event.preventDefault();
    loadIP_Search();
}


function loadIP_Search() {
    let range_ip = document.getElementById("ipRangeInput").value;
    var tableBody = document.getElementById("tableBody");
    if (tableBody.innerHTML !== "") {
        tableBody.innerHTML = "";
    }
    var range = range_ip.split("-");
    var start_ip = range[0];
    var end_ip = range[1];
    var start_ip_arr = start_ip.split(".");
    var end_ip_arr = end_ip.split(".");
    var start_ip_num = parseInt(start_ip_arr[3]);
    var end_ip_num = parseInt(end_ip_arr[3]);
    console.log("Start IP: " + start_ip_num);
    console.log("End IP: " + end_ip_num);
    for (let i = 1; i <= 3; i++) {
        fetch(`src/data/40${i}.json`)
            .then(response => response.json())
            .then(data => {
                for (let j = 0; j < data.length; j++) {
                    data_arr.push(data[j]);
                    let ip_arr = data[j].ip;
                    console.log("IP: " + ip_arr);
                    let _ip_arr = ip_arr.split(".");
                    let ip_num = parseInt(_ip_arr[3]);
                    console.log("Checking IP: " + ip_num);
                    if (ip_num >= start_ip_num && ip_num <= end_ip_num) {
                        const row = document.createElement('tr');
                        row.classList.add('highlight-row');

                        row.innerHTML = `
                            <td>${data[j].name}</td>
                            <td>${data[j].ip}</td>
                            <td>${data[j].os}</td>
                            <td>${data[j].cpu}</td>
                            <td>${data[j].memory}</td>
                            <td>${data[j].disk}</td>
                            <td>${data[j].status}</td>
                            <td class="border px-4 py-2">
                                <button class="openModalBtn"><i class="fas fa-desktop"></i></button>
                            </td>
                            `;

                        tableBody.appendChild(row);
                    }
                    attachModalEvents();
                    if (!osData[data[j].os]) osData[data[j].os] = 0;
                    osData[data[j].os]++;
                    if (!ramData[data[j].memory]) ramData[data[j].memory] = 0;
                    ramData[data[j].memory]++
                    if (!diskData[data[j].disk]) diskData[data[j].disk] = 0;
                    diskData[data[j].disk]++;
                }
            });
        drawCharts();

    }
}

// Hàm để vẽ biểu đồ
function drawCharts() {
    // Tạo biểu đồ OS Distribution
    let osLabels = Object.keys(osData);
    let osCounts = Object.values(osData);

    console.log(osLabels);
    console.log(osCounts);
    const osChartCtx = document.getElementById('osChart').getContext('2d');
    const osChart = new Chart(osChartCtx, {
        type: 'doughnut', data: {
            labels: osLabels, datasets: [{
                data: osCounts, backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }]
        }, options: {
            responsive: true, maintainAspectRatio: false
        }
    });

    // Tạo biểu đồ RAM Distribution
    const ramLabels = Object.keys(ramData);
    const ramCounts = Object.values(ramData);
    const ramChartCtx = document.getElementById('ramChart').getContext('2d');
    const ramChart = new Chart(ramChartCtx, {
        type: 'doughnut', data: {
            labels: ramLabels, datasets: [{
                data: ramCounts, backgroundColor: ['#cc1f1a', '#ff6384', '#36a2eb', '#ffce56']
            }]
        }, options: {
            responsive: true, maintainAspectRatio: false
        }
    });

    // Tao bieu do DISK Distribution
    const diskLabels = Object.keys(diskData);
    const diskCounts = Object.values(diskData);
    const diskChartCtx = document.getElementById('diskChart').getContext('2d');
    const diskChart = new Chart(diskChartCtx, {
        type: 'doughnut', data: {
            labels: diskLabels, datasets: [{
                data: diskCounts, backgroundColor: ['#cc1f1a', '#ff6384', '#36a2eb', '#ffce56']
            }]
        }, options: {
            responsive: true, maintainAspectRatio: false
        }
    });
}


function attachModalEvents() {
    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.closeBtn');

    document.querySelectorAll('.openModalBtn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của nút
            modal.style.display = 'block';
            const row = this.closest('tr');
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
        <h2>${row.cells[0].innerText}</h2>
        <p>IP: ${row.cells[1].innerText}</p>
        <p>OS: ${row.cells[2].innerText}</p>
        <p>CPU: ${row.cells[3].innerText}</p>
        <p>RAM: ${row.cells[4].innerText}</p>
        <p>Disk: ${row.cells[5].innerText}</p>
        <p>Status: ${row.cells[6].innerText}</p>
    `;
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('stopButton').addEventListener('click', function callResetAPI(id, room) {
        const data = {
            id: id, room: room
        };

        fetch('/src/remote/restart.py', {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('resetButton').addEventListener('click', function callResetAPI(id, room) {
        const data = {
            id: id, room: room
        };

        // Gọi API reset
        fetch('/src/remote/restart.py', {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(data),
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('sleepButton').addEventListener('click', function () {
        alert('Sleep button clicked');
    });

    document.getElementById('updateButton').addEventListener('click', function () {
        alert('Update button clicked');
    });
}

