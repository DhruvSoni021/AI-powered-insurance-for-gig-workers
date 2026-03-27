/* ============================================
   GIGSHIELD AI RISK ENGINE
   Advanced Hackathon Version
============================================ */

document.addEventListener("DOMContentLoaded", () => {

  const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // add if you want real weather
  let baseRiskScore = 52;

  const riskArc = document.getElementById("riskArc");
  const riskScoreText = document.getElementById("riskScoreText");
  const riskBadgeLabel = document.getElementById("riskBadgeLabel");
  const simStatus = document.getElementById("simStatus");

  const circumference = 402;

  /* ============================
     RISK ANIMATION
  ============================ */
  function updateRisk(score, label) {

    const offset = circumference - (score / 100) * circumference;
    riskArc.style.strokeDashoffset = offset;

    let current = 0;
    const counter = setInterval(() => {
      if (current >= score) clearInterval(counter);
      else {
        current++;
        riskScoreText.textContent = current;
      }
    }, 15);

    riskBadgeLabel.textContent = label;
  }

  updateRisk(baseRiskScore, "Moderate");


  /* ============================
     BREAKDOWN BARS
  ============================ */
  document.querySelectorAll(".rsb-bar").forEach(bar => {
    const width = bar.dataset.width;
    setTimeout(() => {
      bar.style.width = width + "%";
    }, 300);
  });


  /* ============================
     LOCATION + WEATHER AI
  ============================ */
  function calculateWeatherRisk(weather) {
    let risk = baseRiskScore;

    if (weather.includes("Rain")) risk += 10;
    if (weather.includes("Thunderstorm")) risk += 18;
    if (weather.includes("Clouds")) risk += 3;
    if (weather.includes("Extreme")) risk += 25;

    return Math.min(risk, 95);
  }

  function setRiskLabel(score) {
    if (score < 40) return "Low";
    if (score < 70) return "Moderate";
    if (score < 85) return "High";
    return "Critical";
  }

  function loadWeather(lat, lon) {
    if (API_KEY === "23cf0e9e834b01dd83354804c7f47385") return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {

        const weatherMain = data.weather[0].main;
        const risk = calculateWeatherRisk(weatherMain);
        const label = setRiskLabel(risk);

        setTimeout(() => {
          updateRisk(risk, label);
        }, 800);

      });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      loadWeather(pos.coords.latitude, pos.coords.longitude);
    });
  }


  /* ============================
     AI SIMULATION ENGINE
  ============================ */
  const simButtons = document.querySelectorAll(".sim-btn");
  const simResultBox = document.getElementById("simResultBox");
  const simEventName = document.getElementById("simEventName");
  const simNewScore = document.getElementById("simNewScore");
  const simPremium = document.getElementById("simPremium");
  const simCoverage = document.getElementById("simCoverage");
  const simResetBtn = document.getElementById("simResetBtn");

  simButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      simStatus.textContent = "AI analyzing scenario...";
      simStatus.style.color = "#f59e0b";

      const eventName = btn.dataset.event;
      const score = parseInt(btn.dataset.score);

      setTimeout(() => {

        const premiumIncrease = Math.floor(score * 0.6);
        const label = setRiskLabel(score);

        updateRisk(score, label);

        simEventName.textContent = eventName.toUpperCase();
        simNewScore.textContent = score;
        simPremium.textContent = "+₹" + premiumIncrease;
        simCoverage.textContent = "Expanded Coverage";

        simResultBox.style.display = "block";

        simStatus.textContent = "Simulation Complete";
        simStatus.style.color = "#22c55e";

      }, 1200);
    });
  });

  simResetBtn.addEventListener("click", () => {
    updateRisk(baseRiskScore, "Moderate");
    simResultBox.style.display = "none";
    simStatus.textContent = "Ready";
    simStatus.style.color = "";
  });


  /* ============================
     AI FORECAST CHART
  ============================ */
  new Chart(document.getElementById("forecastChart"), {
    type: "line",
    data: {
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      datasets: [{
        label: "Predicted Risk",
        data: [50, 55, 70, 75, 72, 60, 58],
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });


  /* ============================
     CLAIMS AI ANALYTICS
  ============================ */
  let claimsChart = new Chart(document.getElementById("claimsChart"), {
    type: "bar",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun"],
      datasets: [
        { label: "Approved", data: [5,7,6,8,7,9] },
        { label: "Pending", data: [2,3,2,4,3,2] },
        { label: "Review", data: [1,1,2,1,2,1] }
      ]
    }
  });

  document.getElementById("toggleBar").onclick = () => {
    claimsChart.destroy();
    claimsChart = new Chart(document.getElementById("claimsChart"), {
      type: "bar",
      data: claimsChart.data
    });
  };

  document.getElementById("toggleLine").onclick = () => {
    claimsChart.destroy();
    claimsChart = new Chart(document.getElementById("claimsChart"), {
      type: "line",
      data: claimsChart.data
    });
  };


  /* ============================
     COVERAGE DONUT
  ============================ */
  new Chart(document.getElementById("coverageDonut"), {
    type: "doughnut",
    data: {
      labels: ["Used", "Remaining"],
      datasets: [{
        data: [30, 70]
      }]
    },
    options: {
      cutout: "72%",
      plugins: { legend: { display: false } }
    }
  });


  /* ============================
     RISK TREND AI
  ============================ */
  new Chart(document.getElementById("riskTrendChart"), {
    type: "line",
    data: {
      labels: ["Oct","Nov","Dec","Jan","Feb","Mar"],
      datasets: [{
        label: "Risk Score",
        data: [40, 46, 48, 51, 53, 64],
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

});


const API_KEY = "23cf0e9e834b01dd83354804c7f47385";

const locationBox = document.getElementById("workerLocation");
const riskScore = document.getElementById("riskScore");

function getWorkerLocation() {
  if (!navigator.geolocation) {
    locationBox.innerText = "Location not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

      console.log("Weather API Data:", data);

      const city = data.name;
      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].main;
      const wind = data.wind.speed;

      locationBox.innerHTML = `📍 ${city} | ${temp}°C | ${weather}`;

      calculateRisk(temp, weather, wind);
    });
}

function calculateRisk(temp, weather, wind) {
  let risk = 40;

  if (temp > 35) risk += 10;
  if (weather === "Rain") risk += 20;
  if (weather === "Thunderstorm") risk += 30;
  if (wind > 10) risk += 10;

  if (risk > 100) risk = 100;

  if (riskScore) {
    riskScore.innerText = risk + "%";
  }
}

function error() {
  locationBox.innerText = "Location permission denied";
}

getWorkerLocation();