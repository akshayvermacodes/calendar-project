let currentDate = new Date();
let clickCount = {}; // track clicks per date across months

function renderCalendar(date) {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  calendar.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  monthYear.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty blocks to align the first date to the correct weekday
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendar.appendChild(empty);
  }

  // Render days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.classList.add("day");

    const key = `${year}-${month}-${i}`;
    clickCount[key] = clickCount[key] || 0;

    day.setAttribute("data-key", key); // for reset targeting

    // Initial render: bold date
    day.innerHTML = `<div style="font-weight:bold; font-size:18px;">${i}</div>`;

    day.addEventListener("click", () => {
      clickCount[key]++;

      // Reset base state each click
      day.classList.remove("selected");
      day.innerHTML = `<div style="font-weight:bold; font-size:18px;">${i}</div>`;

      const state = clickCount[key] % 4;

      if (state === 1) {
        // 1st click → green check + blue highlight
        day.classList.add("selected");
        day.innerHTML = `
          <div style="font-size:26px; color:green;">✔</div>
          <div style="font-weight:bold; font-size:18px;">${i}</div>
        `;
      } else if (state === 2) {
        // 2nd click → bold only (no blue)
        day.innerHTML = `<div style="font-weight:bold; font-size:18px;">${i}</div>`;
      } else if (state === 3) {
        // 3rd click → check + star + blue highlight
        day.classList.add("selected");
        day.innerHTML = `
          <div style="font-size:26px; color:green;">✔</div>
          <div style="font-weight:bold; font-size:18px;">${i}</div>
          <div style="font-size:22px; color:gold; text-shadow:0 0 6px orange;">★</div>
        `;
      } else {
        // 4th click → reset marks, keep bold (no blue)
        day.innerHTML = `<div style="font-weight:bold; font-size:18px;">${i}</div>`;
      }
    });

    calendar.appendChild(day);
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
}

function resetCurrentMonth() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const allDays = document.querySelectorAll(".day");
  allDays.forEach(day => {
    const key = day.getAttribute("data-key");
    if (key && key.startsWith(`${year}-${month}-`)) {
      clickCount[key] = 0;
      day.classList.remove("selected");
      const date = key.split("-")[2];
      day.innerHTML = `<div style="font-weight:bold; font-size:18px;">${date}</div>`;
    }
  });
}

renderCalendar(currentDate);
