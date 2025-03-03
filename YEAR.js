const dayElement = document.getElementById("day");
const hourElement = document.getElementById("hour");
const minuteElement = document.getElementById("minute");
const secondElement = document.getElementById("second");

const newYearDate = new Date("october 2, 2024 00:0:00").getTime();
updateCountdown();
function updateCountdown() {
  const now = new Date().getTime();
  const gap = now - newYearDate;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const d = Math.floor(gap / day);
  const h = Math.floor((gap % day) / hour);
  const m = Math.floor((gap % hour) / minute);
  const s = Math.floor((gap % minute) / second);

  hourElement.innerText = (h < 10 ? "0" : "") + h;
  minuteElement.innerText = (m < 10 ? "0" : "") + m;
  secondElement.innerText = (s < 10 ? "0" : "") + s;
  dayElement.innerHTML = (d < 10 ? "0" : "") + d;
  setTimeout(updateCountdown, 1000);
}
