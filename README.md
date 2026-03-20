# AI-powered-insurance-for-gig-workers


## 1. Problem Statement
Gig workers in India face significant income volatility due to factors beyond their control. External disruptions—such as heavy rainfall, heatwaves, air pollution, or natural disasters can reduce working hours and lead to income losses of up to 20–30% per month.

Currently, there is no structured income protection mechanism tailored for gig workers against these risks. When disruptions occur, workers bear the full financial impact without any compensation or safety net.

The challenge is to design and build an AI-enabled parametric insurance platform that:

Provides income protection against external, measurable disruptions (e.g., weather, environmental conditions)

Enables automated payouts based on predefined triggers (no manual claims required)

Incorporates intelligent fraud detection mechanisms

Operates on a simple weekly pricing model, aligned with gig workers’ earning cycles

---

## 2. Target Users (Personas)

### Persona 2: Insurance Company
Company that manages policies and claims.

Workflow:
1. User Onboarding
2. Weekly Subscription & Policy Activation
3. Real-Time Data Monitoring
4. Trigger Detection
5. Fraud Detection Layer
6. Automated Payout Processing
7. User Dashboard & Notifications

---

## 3. Weekly Premium Model

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

---

## 4. Platform Choice

We are building a **Web Application** because:
- Easy to access from any device
- No installation required
- Faster development

Future plan:
Mobile App version.

---

## 5. AI/ML Integration

AI will be used for:

Premium Prediction Model
Fraud Detection System
Risk Analysis

Example:
Machine Learning will analyze user data and predict risk level.

---

## 6. Tech Stack

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

## 7. Development Plan

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

## 8. Future Improvements

Mobile App
Chatbot Support
Real-time Claim Tracking
Better AI Model

## 9. Authentication
User authentication will be implemented using JWT (JSON Web Tokens).

Features:
- User Signup
- User Login
- Secure password storage
- Role based access (Customer / Admin)

---

## 10. Deployment
The prototype will be deployed using:

Frontend: Vercel  
Backend: Render  
Database: MongoDB Atlas  

The application will be connected through GitHub for continuous deployment.

---

##  Working Prototype (Phase 1 Scope)

For this phase, the prototype will include:

###  User Authentication

* Login & Signup functionality
* Basic user profile

###  Smart Dashboard

* Displays:

  * Distance covered (mock data)
  * Weekly earnings
  * Risk score
  * Suggested premium

###  Insurance Plan Listing

* Basic, Standard, Premium plans
* Coverage + pricing details

###  Dynamic Premium Calculator

* Inputs:

  * Distance
  * Working hours
  * Shift type
* Outputs:

  * Weekly premium
  * Risk score

###  Risk Score System

* Calculates user risk based on:

  * Distance traveled
  * Night shifts
  * Area risk

###  Basic Fraud Detection (Rule-Based)

* Detects:

  * Repeated claims
  * Unrealistic inputs

---

###  Note:

This prototype demonstrates the core functionality along with initial implementation of intelligent risk-based pricing and decision-making.

---

 Adversarial Defense & Anti-Spoofing Strategy
1. Differentiation: Genuine User vs Spoofed Activity

To prevent GPS spoofing attacks, our system moves beyond single-point location verification and adopts a multi-layer behavioral intelligence model.

Instead of trusting raw GPS data, we analyze:

- Movement Continuity: Genuine delivery partners exhibit natural movement patterns (routes, stops, speed variation). Spoofed GPS often shows unnatural jumps or static positioning.

- Behavioral Profiling: Each user has a historical activity pattern (working hours, average distance covered, delivery frequency). Sudden deviations trigger risk flags.

- Sensor Fusion Validation: GPS data is cross-verified with device sensors (accelerometer, gyroscope). A user claiming movement but showing no physical motion is flagged.

- Geo-Context Consistency: Claimed location is validated against real-world constraints (roads, traffic patterns, delivery zones).

This creates a trust score for each claim, allowing the system to differentiate between genuine distress situations and manipulated inputs.

2. Data Signals for Fraud Detection

To detect coordinated fraud rings, our platform leverages multiple data sources beyond GPS:

- Device Sensor Data: Accelerometer and gyroscope to confirm physical movement

- Network Metadata: Signal strength, network switching patterns (WiFi ↔ Mobile Data)

- Delivery Activity Logs: Integration with platforms (e.g., order pickups, drop-offs)

- Weather Correlation: Matching user activity with real-time weather severity

- Device Fingerprinting: Identifying repeated usage patterns across devices/accounts

- Cluster Detection: Identifying multiple users showing identical or synchronized suspicious behavior (indicative of organized fraud groups)

- Time-Based Patterns: Simultaneous claim spikes from a specific region

Using these signals, an AI-based anomaly detection model flags suspicious claims and detects coordinated exploitation attempts.

3. UX Balance: Fair Handling of Flagged Claims

To ensure honest delivery partners are not unfairly penalized, the system follows a graceful verification workflow:

Soft Flagging (Not Immediate Rejection): Suspicious claims are marked for review instead of being denied

Step-Up Verification:

- Quick selfie or short video confirmation

- Live location revalidation

- Optional manual confirmation prompt

Delayed Payout Mechanism: Claims under review are processed with slight delay instead of rejection

Trust Score System:

- High-trust users (based on history) face fewer checks

- New or suspicious accounts undergo stricter validation

User Transparency:

- Clear communication on why a claim is flagged

- Simple steps to resolve and proceed

This ensures a balance between fraud prevention and user trust, maintaining platform reliability without harming genuine users.
