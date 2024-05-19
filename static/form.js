
// Giả sử data là một mảng chứa dữ liệu các máy tính
const data = [
    { name: "PC1", ip: "192.168.1.10", os: "Windows 10", cpu: "Intel Core i5", ram: "8GB", disk: "256GB SSD", status: "With WAN" },
    { name: "PC2", ip: "192.168.1.11", os: "Windows 11", cpu: "Intel Core i5", ram: "16GB", disk: "512GB SSD", status: "Without WAN" },
    { name: "PC3", ip: "192.168.1.12", os: "Ubuntu", cpu: "Intel Core i3", ram: "4GB", disk: "512GB SSD", status: "Without WAN" },
    { name: "PC4", ip: "192.168.1.13", os: "Ubuntu", cpu: "Intel Core i3", ram: "64GB", disk: "256GB SSD", status: "Without WAN" },
    { name: "PC5", ip: "192.168.1.14", os: "Mac", cpu: "Intel Core i7", ram: "4GB", disk: "128GB SSD", status: "Without WAN" },
    { name: "PC6", ip: "192.168.1.15", os: "Mac", cpu: "Intel Core i7", ram: "16GB", disk: "128GB SSD", status: "Without WAN" },
    // Thêm các dữ liệu máy tính khác tương tự
];

// Hàm để cập nhật bảng với dữ liệu mới
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ của bảng

    data.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('highlight-row');

        row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.ip}</td>
        <td>${item.os}</td>
        <td>${item.cpu}</td>
        <td>${item.ram}</td>
        <td>${item.disk}</td>
        <td>${item.status}</td>
        <td class="border px-4 py-2">
            <button class="openModalBtn"><i class="fas fa-desktop"></i></button>
        </td>
        `;

        tableBody.appendChild(row);
    });

    // Gọi lại hàm để vẽ biểu đồ sau khi bảng được cập nhật
    drawCharts();
    attachModalEvents();
}

// Gọi hàm cập nhật bảng khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    updateTable();
});

// Hàm để vẽ biểu đồ
function drawCharts() {
    // Lấy dữ liệu từ bảng và tính toán phân phối OS
    const osData = {};
    const ramData = {};
    let wanWith = 0;
    let wanWithout = 0;

    document.querySelectorAll('#tableBody tr').forEach(row => {
        const os = row.cells[2].innerText;
        const ram = row.cells[4].innerText;
        const status = row.cells[6].innerText;
        if (!osData[os]) osData[os] = 0;
        osData[os]++;
        if (!ramData[ram]) ramData[ram] = 0;
        ramData[ram]++;
        if (status === 'With WAN') {
            wanWith++;
        } else if (status === 'Without WAN') {
            wanWithout++;
        }
    });

    // Tạo biểu đồ OS Distribution
    const osLabels = Object.keys(osData);
    const osCounts = Object.values(osData);
    const osChartCtx = document.getElementById('osChart').getContext('2d');
    const osChart = new Chart(osChartCtx, {
        type: 'doughnut',
        data: {
            labels: osLabels,
            datasets: [{
                data: osCounts,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Tạo biểu đồ RAM Distribution
    const ramLabels = Object.keys(ramData);
    const ramCounts = Object.values(ramData);
    const ramChartCtx = document.getElementById('ramChart').getContext('2d');
    const ramChart = new Chart(ramChartCtx, {
        type: 'doughnut',
        data: {
            labels: ramLabels,
            datasets: [{
                data: ramCounts,
                backgroundColor: ['#cc1f1a', '#ff6384', '#36a2eb', '#ffce56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Tạo biểu đồ WAN Distribution
    const wanTotal = wanWith + wanWithout;
    const wanWithPercentage = (wanWith / wanTotal) * 100;
    const wanWithoutPercentage = (wanWithout / wanTotal) * 100;
    const wanChartCtx = document.getElementById('wanChart').getContext('2d');
    const wanChart = new Chart(wanChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['With WAN', 'Without WAN'],
            datasets: [{
                data: [wanWithPercentage, wanWithoutPercentage],
                backgroundColor: ['#36a2eb', '#ff6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Cập nhật biểu tượng thao tác tùy theo trạng thái
    document.querySelectorAll('#tableBody tr').forEach(row => {
        const statusCell = row.cells[6];
        const actionCell = row.cells[7];
        const status = statusCell.innerText;
        actionCell.innerHTML = status === 'With WAN' ?
            `<button class="openModalBtn bg-teal-300 cursor-pointer rounded p-1 mx-1 text-white"><i class="fas fa-desktop"></i></button>` :
            `<button class="openModalBtn"><i class="fas fa-desktop"></i></button>`;
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

    document.getElementById('stopButton').addEventListener('click', function () {
        alert('Stop button clicked');
    });

    document.getElementById('resetButton').addEventListener('click', function () {
        alert('Reset button clicked');
    });

    document.getElementById('sleepButton').addEventListener('click', function () {
        alert('Sleep button clicked');
    });

    document.getElementById('updateButton').addEventListener('click', function () {
        alert('Update button clicked');
    });
}

