const API = "http://localhost:5000";

function showNotification(message) {
    window.alert(message);
}

// Local state for demo (persistent via localStorage)
function setCurrentUser(user) {
    localStorage.setItem("workerPolicy", JSON.stringify(user));
}

function getCurrentUser() {
    const stored = localStorage.getItem("workerPolicy");
    return stored ? JSON.parse(stored) : null;
}

// Register Worker
async function register() {
    const user = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        workType: document.getElementById("workType").value.trim(),
        location: document.getElementById("location").value.trim(),
        riskScore: Math.floor(Math.random() * 3) + 1,
        premium: 0,
        policyStatus: "pending"
    };

    if (!user.name || !user.phone || !user.workType || !user.location) {
        showNotification("Please fill all fields before registering.");
        return;
    }

    // Save in local state for simple demo UI navigation.
    setCurrentUser(user);

    // Call backend for registration if API exists
    try {
        const res = await fetch(`${API}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        if (res.ok) {
            showNotification("Registration successful. Your AI Risk Score is " + user.riskScore);
            window.location.href = "Dashboard.html";
        } else {
            showNotification("Registration saved locally; backend API did not respond.");
        }
    } catch (err) {
        showNotification("Offline mode: registration saved locally.");
    }
}

// Calculate AI Premium and save the policy
async function calculatePremium() {
    const user = getCurrentUser();
    if (!user) {
        showNotification("Please register first.");
        return;
    }

    const formula = (base, weatherRisk, areaRisk, safeDiscount) => base + weatherRisk + areaRisk - safeDiscount;
    const weatherRisk = user.riskScore * 8;
    const areaRisk = Math.floor(Math.random() * 15);
    const safeDiscount = user.location.toLowerCase().includes("safe") ? 5 : 0;

    const premium = formula(20, weatherRisk, areaRisk, safeDiscount);
    user.premium = premium;
    user.policyStatus = "active";
    setCurrentUser(user);

    showNotification(`Weekly Premium: ₹${premium}\nDetails: weatherRisk=${weatherRisk}, areaRisk=${areaRisk}, safeDiscount=${safeDiscount}`);

    // Optional backend call
    try {
        await fetch(`${API}/policies/premium`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ basePremium: 20, riskScore: user.riskScore, city: user.location })
        });
    } catch (err) {
        // ignore
    }
}

// Trigger Claim Automatically
async function triggerClaim() {
    const user = getCurrentUser();
    if (!user || user.policyStatus !== "active") {
        showNotification("Active policy required to trigger claim.");
        return;
    }

    const claimPayload = {
        userId: user.phone,
        reason: "Weather Disruption",
        status: "pending",
        amount: Math.floor((user.premium || 40) * 10)
    };

    // Simple fraud check emulation
    const fraudCheck = claimPayload.amount < 1000;
    if (!fraudCheck) {
        showNotification("Fraud check failed. Claim denied.");
        return;
    }

    // Save claim in session storage for claims page display
    const existing = JSON.parse(localStorage.getItem("claimsList") || "[]");
    existing.push({ ...claimPayload, status: "approved" });
    localStorage.setItem("claimsList", JSON.stringify(existing));

    // Backend post
    try {
        const res = await fetch(`${API}/claims/auto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(claimPayload)
        });
        const data = await res.json();
        showNotification(`Claim approved: ₹${data.amount || claimPayload.amount}`);
    } catch (err) {
        showNotification(`Claim approved locally: ₹${claimPayload.amount}`);
    }
}

// Load Claims
async function loadClaims() {
    const claims = JSON.parse(localStorage.getItem("claimsList") || "[]");

    const list = document.getElementById("claimsList");
    if (!list) return;

    list.innerHTML = "";

    claims.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.userId}</td>
            <td>₹${c.amount}</td>
            <td>${c.status}</td>
            <td>${c.reason || 'N/A'}</td>
        `;
        list.appendChild(tr);
    });

    // Update stats
    const statsEl = document.getElementById("claimsStats");
    if (statsEl) {
        const total = claims.length;
        const approved = claims.filter(c => c.status === "approved").length;
        const pending = claims.filter(c => c.status === "pending").length;
        const totalPaid = claims.reduce((sum, c) => sum + (c.status === "approved" ? Number(c.amount) : 0), 0);
        statsEl.innerText = `Total Claims: ${total} | Approved: ${approved} | Pending: ${pending} | Total Paid: ₹${totalPaid}`;
    }

    // optionally fetch from backend to sync
    try {
        const res = await fetch(`${API}/claims`);
        if (res.ok) {
            const remoteClaims = await res.json();
            remoteClaims.forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${c.userId} (API)</td>
                    <td>₹${c.amount}</td>
                    <td>${c.status}</td>
                    <td>${c.reason || 'N/A'}</td>
                `;
                list.appendChild(tr);
            });
        }
    } catch (err) {
        // ignore connectivity errors
    }
}

function loadDashboard() {
    const user = getCurrentUser();
    if (!user) {
        return;
    }

    const activePolicyEl = document.getElementById("activePolicy");
    const weeklyPremiumEl = document.getElementById("weeklyPremium");
    const claimsStatusEl = document.getElementById("claimsStatus");
    const incomeProtectedEl = document.getElementById("incomeProtected");

    const claims = JSON.parse(localStorage.getItem("claimsList") || "[]");
    const approved = claims.filter(c => c.status === "approved").length;
    const pending = claims.filter(c => c.status === "pending").length;
    const totalPaid = claims.reduce((sum, c) => sum + (c.status === "approved" ? Number(c.amount) : 0), 0);

    activePolicyEl.innerText = `${user.policyStatus.toUpperCase()} (${user.workType}, ${user.location})`;
    weeklyPremiumEl.innerText = `₹${user.premium || 0}`;
    claimsStatusEl.innerText = `${approved} approved / ${pending} pending`;
    incomeProtectedEl.innerText = `₹${totalPaid}`;

    // Top profile details panel
    const info = document.createElement("div");
    info.style.marginBottom = "20px";
    info.className = "dashboard-card";
    info.innerHTML =
        `<h3>${user.name}</h3>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Location:</strong> ${user.location}</p>
        <p><strong>Work Type:</strong> ${user.workType}</p>
        <p><strong>Risk Score:</strong> ${user.riskScore}</p>
        <p><strong>Policy:</strong> ${user.policyStatus}</p>`;

    const container = document.querySelector(".container");
    if (container) container.insertBefore(info, container.firstChild);

    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityList = document.getElementById("activityList");
    if (!activityList) return;

    const user = getCurrentUser();
    const claims = JSON.parse(localStorage.getItem("claimsList") || "[]");

    activityList.innerHTML = "";

    if (user && user.policyStatus === "active") {
        const li = document.createElement("li");
        li.innerText = `Policy activated for ${user.name}`;
        activityList.appendChild(li);
    }

    if (user && user.premium) {
        const li = document.createElement("li");
        li.innerText = `Premium calculated: ₹${user.premium}`;
        activityList.appendChild(li);
    }

    claims.slice(-3).forEach(c => {
        const li = document.createElement("li");
        li.innerText = `Claim ${c.status}: ₹${c.amount} for ${c.reason}`;
        activityList.appendChild(li);
    });

    if (activityList.children.length === 0) {
        const li = document.createElement("li");
        li.innerText = "No recent activity";
        activityList.appendChild(li);
    }
}

if (document.readyState !== 'loading') {
    loadDashboard();
} else {
    document.addEventListener('DOMContentLoaded', loadDashboard);
}
