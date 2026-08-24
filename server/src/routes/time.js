const express = require("express");
const router = express.Router();

// 1. Get Live Year Progress Metrics
router.get("/progress", (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const totalMs = endOfYear.getTime() - startOfYear.getTime();
  const elapsedMs = now.getTime() - startOfYear.getTime();

  const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));
  const dayOfYear = Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1;
  const daysRemaining = totalDays - dayOfYear;

  const percentageCompleted = Math.min(
    100,
    Math.max(0, (elapsedMs / totalMs) * 100),
  );
  const percentageRemaining = 100 - percentageCompleted;

  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

  res.json({
    year,
    percentageCompleted,
    percentageRemaining,
    dayOfYear,
    totalDays,
    daysRemaining,
    currentQuarter,
  });
});

// 2. Perform Age & Date Calculation (POST)
router.post("/calculate", (req, res) => {
  const { birthDate, targetDate } = req.body;
  if (!birthDate) {
    return res.status(400).json({ error: "birthDate is required" });
  }

  const start = new Date(birthDate);
  const end = targetDate ? new Date(targetDate) : new Date();

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthEnd = new Date(
      end.getFullYear(),
      end.getMonth(),
      0,
    ).getDate();
    days += prevMonthEnd;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  res.json({
    years,
    months,
    days,
    totalDays,
    totalHours,
  });
});

// 3. Compute Custom Event Countdown
router.post("/countdown", (req, res) => {
  const { eventName, eventDate } = req.body;
  if (!eventDate) {
    return res.status(400).json({ error: "eventDate is required" });
  }

  const target = new Date(eventDate);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs < 0) {
    return res.json({
      eventName,
      status: "passed",
      daysRemaining: 0,
      hoursRemaining: 0,
    });
  }

  const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  res.json({
    eventName,
    status: "upcoming",
    daysRemaining,
    hoursRemaining,
  });
});

module.exports = router;
