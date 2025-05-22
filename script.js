let data = JSON.parse(localStorage.getItem("userData")) || [];

function renderTable(filtered = data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  filtered.forEach((row, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${row.fullName}</td>
        <td>${row.motherName}</td>
        <td>${row.birthDate}</td>
        <td>${row.address}</td>
        <td>${row.nickname}</td>
        <td>${row.phoneNumber}</td>
        <td><img src="${row.imageData}" width="50"></td>
        <td>
          <button onclick="editData(${index})">تعديل</button>
          <button onclick="deleteData(${index})">حذف</button>
        </td>
      </tr>`;
  });
}

function addData() {
  const row = {
    fullName: document.getElementById("fullName").value,
    motherName: document.getElementById("motherName").value,
    birthDate: document.getElementById("birthDate").value,
    address: document.getElementById("address").value,
    nickname: document.getElementById("nickname").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    imageData: document.getElementById("imagePreview").src
  };
  data.push(row);
  localStorage.setItem("userData", JSON.stringify(data));
  renderTable();
}

function deleteData(index) {
  if (confirm("هل أنت متأكد من الحذف؟")) {
    data.splice(index, 1);
    localStorage.setItem("userData", JSON.stringify(data));
    renderTable();
  }
}

function editData(index) {
  const row = data[index];
  document.getElementById("fullName").value = row.fullName;
  document.getElementById("motherName").value = row.motherName;
  document.getElementById("birthDate").value = row.birthDate;
  document.getElementById("address").value = row.address;
  document.getElementById("nickname").value = row.nickname;
  document.getElementById("phoneNumber").value = row.phoneNumber;
  document.getElementById("imagePreview").src = row.imageData;
  deleteData(index);
}

document.getElementById("imageInput").addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("imagePreview").src = e.target.result;
  };
  reader.readAsDataURL(this.files[0]);
});

document.getElementById("searchBox").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  const filtered = data.filter(d =>
    Object.values(d).some(v => v.toLowerCase().includes(val))
  );
  renderTable(filtered);
});

function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data.map(d => ({
    "الاسم": d.fullName,
    "اسم الأم": d.motherName,
    "المواليد": d.birthDate,
    "السكن": d.address,
    "اللقب": d.nickname,
    "الهاتف": d.phoneNumber
  })));
  XLSX.utils.book_append_sheet(wb, ws, "بيانات");
  XLSX.writeFile(wb, "بيانات.xlsx");
}

function importFromExcel(evt) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const importedData = XLSX.utils.sheet_to_json(worksheet);
    importedData.forEach(item => {
      data.push({
        fullName: item["الاسم"],
        motherName: item["اسم الأم"],
        birthDate: item["المواليد"],
        address: item["السكن"],
        nickname: item["اللقب"],
        phoneNumber: item["الهاتف"],
        imageData: "" // الصور لا تُستورد من الإكسل، يتم إضافتها يدويًا
      });
    });
    localStorage.setItem("userData", JSON.stringify(data));
    renderTable();
  };
  reader.readAsBinaryString(evt.target.files[0]);
}

renderTable();
