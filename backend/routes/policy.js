import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// ──────────────────────────────────────────────────────────────
// POST /policy/create
// Protected route – requires Bearer JWT
// Body: { userId, policyType, coverageAmount, startDate,
//         endDate, premiumFrequency, additionalRiders? }
// Creates a new insurance policy for a gig worker
// ──────────────────────────────────────────────────────────────
router.post("/create", authenticate, async (req, res) => {
  try {
    const {
      userId,
      policyType,        // e.g. "accident", "health", "income-protection", "vehicle"
      coverageAmount,    // numeric, in currency units
      startDate,         // ISO date string
      endDate,           // ISO date string
      premiumFrequency,  // "daily" | "weekly" | "monthly"
      additionalRiders,  // optional array of strings
    } = req.body;

    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: cannot create a policy for another user" });
    }

    if (!userId || !policyType || !coverageAmount || !startDate || !endDate || !premiumFrequency) {
      return res.status(400).json({
        error: "userId, policyType, coverageAmount, startDate, endDate and premiumFrequency are required",
      });
    }

    // Basic premium calculation (simplified model)
    const RATE_MAP = {
      accident: 0.002,
      health: 0.005,
      "income-protection": 0.003,
      vehicle: 0.004,
    };
    const rate = RATE_MAP[policyType] ?? 0.003;
    const estimatedPremium = parseFloat((coverageAmount * rate).toFixed(2));

    // Enforce logic: A user can only have ONE active plan at a time.
    // Supersede/cancel any existing active plans before issuing a new one.
    await supabase
      .from("policies")
      .update({ status: "canceled", end_date: new Date().toISOString().slice(0, 10) })
      .eq("user_id", userId)
      .eq("status", "active");

    const policyPayload = {
      user_id: userId,
      policy_type: policyType,
      coverage_amount: Number(coverageAmount),
      start_date: startDate,
      end_date: endDate,
      premium_frequency: premiumFrequency,
      estimated_premium: estimatedPremium,
      additional_riders: additionalRiders ?? [],
      status: "active",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("policies")
      .insert(policyPayload)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Policy created successfully",
      policy: data,
    });
  } catch (err) {
    console.error("Policy create error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ──────────────────────────────────────────────────────────────
// POST /policy/cancel
// Protected route – requires Bearer JWT
// Body: { userId, policyId }
// Instantly cancels an active insurance policy
// ──────────────────────────────────────────────────────────────
router.post("/cancel", authenticate, async (req, res) => {
  try {
    const { userId, policyId } = req.body;

    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: cannot cancel a policy for another user" });
    }

    if (!userId || !policyId) {
      return res.status(400).json({ error: "userId and policyId are required" });
    }

    const { data, error } = await supabase
      .from("policies")
      .update({ status: "canceled", end_date: new Date().toISOString().slice(0, 10) })
      .eq("id", policyId)
      .eq("user_id", userId)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.error("Cancel failed: no policy matched", { policyId, userId });
      return res.status(404).json({ error: "Policy not found or already canceled in database." });
    }

    return res.status(200).json({ message: "Policy canceled successfully", policy: data[0] });
  } catch (err) {
    console.error("Policy cancel error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
