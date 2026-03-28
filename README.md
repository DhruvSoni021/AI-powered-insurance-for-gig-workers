# AI-powered-insurance-for-gig-workers


## 1. Problem Statement
 
India’s gig economy workers from platforms like Zomato, Swiggy, Zepto, Amazon, and Dunzo rely heavily on daily deliveries for their income.
However, external disruptions such as:
-Extreme heat
-Heavy rainfall
-Flooding
-Severe air pollution
-Curfews or local strikes

can stop them from working and result in 20–30% loss of weekly income.

Currently, gig workers do not have any financial protection against such income disruptions.

Our solution proposes an AI-powered parametric insurance platform that automatically compensates gig workers when such disruptions occur.

---

## 2. Target Users (Personas)

-->Persona: Rahul – Food Delivery Partner
-Age: 24
-Platform: Swiggy
-Location: Delhi
-Average weekly earnings: ₹4000

-->Problem Scenario
On certain days:
-Heavy rainfall stops deliveries
-Severe pollution warnings restrict outdoor work
-Area lockdowns prevent order pickups

Rahul loses around ₹1000–₹1500 weekly income due to such disruptions.

-->Solution Scenario
Rahul subscribes to our weekly insurance plan.
When:
-Rainfall crosses threshold
-AQI becomes hazardous
-Government restrictions stop operations
The system automatically triggers a parametric payout, compensating Rahul for his lost income.

---

## 3.Workflow:

Step 1 – Worker Onboarding

User signs up through the platform.
Information collected:
-Name
-Delivery platform
-Location
-Work zone
-Average weekly income
AI generates a risk profile.

Step 2 – Risk Profiling (AI)

AI models analyze:
-Historical weather data
-Pollution levels
-Disruption frequency
-Delivery zone risk
A risk score is generated which determines the weekly premium.

Step 3 – Policy Creation

Based on the AI risk score, the system suggests a weekly insurance policy.

Example:

Risk Level	      Weekly Premium     	Maximum Weekly Payout
Low Risk            	₹20	                  ₹300
Medium Risk	         ₹40                   ₹600
High Risk	           ₹60	                  ₹900

Workers subscribe to the plan that fits their earnings.

---

## 4. Weekly Premium Model

Premium depends on:
- Age
- Health condition
- Vehicle type (if vehicle insurance)
- Risk score from AI model

Formula Example:
Premium = Base Price + Risk Factor + AI Risk Score

Parametric Triggers:
- Accident detected
- Hospital record uploaded
- Natural disaster event

Gig workers typically earn and withdraw income weekly.
Therefore our pricing model follows a weekly subscription structure.

#vPremium Calculation Factors
AI determines premium using:
-City risk score
-Weather volatility
-Pollution index trends
-Average worker earnings
-Disruption frequency

Example:

Risk Score = 0.65
Weekly Premium = ₹45
Coverage Limit = ₹700

This keeps the insurance affordable while protecting income loss.

---

## 5. Platform Choice

Our system uses automated triggers based on real-world data.

Example triggers:

Event             	          Trigger               Condition	Payout
Extreme Rain	             Rainfall > 100 mm	            ₹400
Extreme Heat	             Temperature > 45°C	           ₹350
Severe Pollution	            AQI > 400	                 ₹300
Zone Closure	            Govt restriction / strike	     ₹500
 
When a trigger is detected:
1.System validates worker location
2.Checks delivery inactivity
3.Automatically processes payout

No manual claim process required.

We are building a **Web Application** because:
- Easy to access from any device
- No installation required
- Faster development

Future plan:
Mobile App version.

---

## 6. AI/ML Integration

AI is used in multiple parts of the system.

1. Risk Prediction Model
Used to calculate weekly premium.

Possible models:
-Random Forest
-Gradient Boosting
-Logistic Regression

Inputs:
-weather history
-disruption frequency
-worker location
-platform demand data

2. Fraud Detection
Prevents fraudulent claims.

AI checks:
-abnormal claim patterns
-location mismatch
-duplicate accounts
-fake inactivity

Algorithms:
-Isolation Forest
-Anomaly Detection Models

3. Income Loss Prediction
Predicts potential income loss based on disruption severity.

Example:
Average Weekly Income = ₹4000
Rainfall Impact = 40%
Estimated Loss = ₹1600

AI will be used for:

Premium Prediction Model
Fraud Detection System
Risk Analysis

Example:
Machine Learning will analyze user data and predict risk level.

---

--> Parametric Automation

The system continuously monitors external data sources.

# Data Sources
-Weather APIs
-AQI monitoring systems
-Traffic and government alerts
-Platform delivery activity

When a threshold is crossed:
-Parametric trigger activated
-Claim initiated automatically
-Fraud checks executed
-Instant payout processed

--> Payment Processing

Payouts are processed automatically through digital payment systems such as:
-Paytm
-PhonePe
-Google Pay

Workers receive compensation directly to their account or wallet.

---

## 7. Tech Stack

Frontend:
HTML
CSS
JavaScript

Backend:
Node.js / Python

Database:
MongoDB

AI/ML:
Python
Scikit-learn

Version Control:
GitHub

---

## 8. Development Plan

Phase 1:
Idea and Documentation

Phase 2:
Basic UI Development

Phase 3:
Backend Integration

Phase 4:
AI Model Integration

Phase 5:
Testing and Deployment

---

## 9. Future Improvements

Mobile App
Chatbot Support
Real-time Claim Tracking
Better AI Model

Possible improvements include:

-Dynamic premium adjustment
-AI-based income forecasting
-Risk heatmaps for cities
-Personalized insurance recommendations

---

## 10. Authentication
User authentication will be implemented using JWT (JSON Web Tokens).

Features:
- User Signup
- User Login
- Secure password storage
- Role based access (Customer / Admin)

---

## 11. Deployment
The prototype will be deployed using:

Frontend: Vercel  
Backend: Render  
Database: MongoDB Atlas  

The application will be connected through GitHub for continuous deployment.

---

## 12.🧪 Working Prototype (Phase 1 Scope)

For this phase, the prototype will include:

🔐 User Authentication

* Login & Signup functionality
* Basic user profile

📊 Smart Dashboard

* Displays:

  * Distance covered (mock data)
  * Weekly earnings
  * Risk score
  * Suggested premium

📋 Insurance Plan Listing

* Basic, Standard, Premium plans
* Coverage + pricing details

🧮 Dynamic Premium Calculator

* Inputs:

  * Distance
  * Working hours
  * Shift type
* Outputs:

  * Weekly premium
  * Risk score

🤖 Risk Score System

* Calculates user risk based on:

  * Distance traveled
  * Night shifts
  * Area risk

🚨 Basic Fraud Detection (Rule-Based)

* Detects:

  * Repeated claims
  * Unrealistic inputs

---

📌 Note:

This prototype demonstrates the core functionality along with initial implementation of intelligent risk-based pricing and decision-making.

---

### 13. 🔐 Adversarial Defense & Anti-Spoofing Strategy

To mitigate GPS spoofing and coordinated fraud, our platform uses a multi-layer trust evaluation system instead of relying on a single data source.

### 🧠 Multi-Signal Movement Validation

Rather than trusting raw GPS data, we evaluate movement authenticity using combined signals:

- **Route Consistency Check**  
  User movement is compared against realistic road paths using map APIs. Sudden jumps, impossible speeds, or off-road movement are flagged.

- **Temporal Movement Patterns**  
  We analyze continuity of movement over time (e.g., gradual transitions vs abrupt teleportation).

- **Sensor Correlation (Lightweight Validation)**  
  GPS data is cross-checked with accelerometer patterns to detect extreme inconsistencies (e.g., long-distance movement with zero motion).

> Note: Sensor data is used as a supporting signal, not a sole decision factor.


---

### 📊 Adaptive Behavioral Profiling

Each user is assigned a dynamic behavior profile based on:

- Typical working hours  
- Average daily distance  
- Delivery frequency  

Instead of strict rules, we use tolerance ranges:

- Minor deviations → ignored  
- Major anomalies → risk score increased  

New users are handled using population-level baseline patterns to avoid cold-start bias.

---

### 🌐 Context-Aware Validation

Claims are validated against real-world conditions:

- Weather API (rain, pollution severity)  
- Traffic and zone accessibility  
- Platform activity (mock delivery logs)  

This ensures:

- Claims align with actual disruption events  
- False claims during normal conditions are flagged  

---

### 🕸️ Fraud Pattern & Cluster Detection

To detect organized fraud attempts, the system monitors:

- Synchronized claim spikes from the same region  
- Device reuse patterns across multiple accounts  
- Identical behavioral signatures across users  

A claim is flagged as coordinated fraud only when:

- Multiple suspicious signals align  
- AND no real-world disruption justifies the spike  

---

### 📈 Trust Score System

Each claim is assigned a confidence score based on weighted signals:

- Movement authenticity  
- Behavioral consistency  
- Context validation  
- Device reliability  

Based on this score:

- High confidence → instant payout  
- Medium confidence → soft verification  
- Low confidence → manual review  

---

### ⚖️ User-Friendly Verification Flow

To balance fraud prevention with user trust:

- **Soft Flagging**  
  Suspicious claims are not rejected immediately  

- **Step-Up Verification (only when needed)**  
  - Live location refresh  
  - Quick in-app confirmation  

- **Priority for Trusted Users**  
  High-trust users face fewer checks  

- **Transparent Feedback**  
  Users are informed why a claim is under review  

---

### ⏱️ Smart Payout Handling

- Instant payouts for high-confidence claims  
- Minimal delay for flagged claims (only when necessary)  

This ensures:

- Fast support for genuine users  
- Controlled risk exposure for the platform  

---

 ### 14. Automated Parametric Payout Triggers

Our system follows a fully automated parametric insurance model. There is no manual claim filing or approval process. Payouts are triggered automatically based on verified external conditions that directly impact a delivery partner’s ability to work.

### How Payouts Are Triggered

The system continuously monitors real-time external data sources such as weather and air quality for the worker’s delivery zone.

When a predefined threshold is crossed:

- System validates the worker’s registered location  
- Confirms disruption conditions in that zone  
- Checks for delivery inactivity during the event  
- Runs fraud detection checks  
- Automatically initiates payout  

No manual claim submission or human intervention is required.

---

### Defined Parametric Triggers

- **Heavy Rain Trigger**  
  If rainfall in the delivery zone exceeds 100 mm/day, payout is triggered  

- **Extreme Heat Trigger**  
  If temperature in the delivery zone exceeds 45°C, payout is triggered  

- **Severe Air Pollution Trigger**  
  If AQI exceeds 400 in the delivery zone, payout is triggered  

These thresholds can be dynamically adjusted based on city risk profiles and historical data.

---

### System Logic Flow

Location → Weather/AQI API → Threshold Check → Activity Validation → Fraud Check → Auto Payout

---

### Implementation Approach

- Real-time APIs (or mock APIs in prototype) provide weather and AQI data  
- Trigger logic is implemented in backend using threshold conditions  
- Mock delivery activity data is used to simulate worker inactivity  
- Automated payout is demonstrated using simulated payment gateway integration  

---

This approach ensures instant, transparent, and reliable compensation while eliminating delays and inefficiencies of traditional insurance claim processes.
