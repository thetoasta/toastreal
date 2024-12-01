const countdown = document.getElementById('countdown');
const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

const newYear = new Date('December 1, 2024 06:00:00').getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = newYear - now;

  const dDays = Math.floor(distance / (1000 * 60 * 60 * 24));
  const dHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const dMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const dSeconds = Math.floor((distance % (1000 * 60)) / 1000);

  days.innerHTML = dDays;
  hours.innerHTML = dHours;
  minutes.innerHTML = dMinutes;
  seconds.innerHTML = dSeconds;
};

setInterval(updateCountdown, 1000);