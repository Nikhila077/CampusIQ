/**
 * Smart Attendance Engine - Core Business Logic Service
 *
 * Implements deterministic, transparent decision support calculations:
 * - Current attendance %
 * - Safe absence buffer (classes student can miss while staying >= minPercent)
 * - Recovery calculation (consecutive classes to attend to reach minPercent)
 * - What-If simulation projections
 * - Transparent, rule-based reasoning insights
 */

/**
 * Calculate single subject attendance metrics
 */
export const calculateSubjectMetrics = ({
  conducted = 0,
  attended = 0,
  minPercent = 75,
  priority = 'medium',
  subjectName = 'Subject'
}) => {
  const c = Math.max(0, Number(conducted) || 0);
  const a = Math.min(c, Math.max(0, Number(attended) || 0));
  const p = Math.min(100, Math.max(1, Number(minPercent) || 75)); // Clamp 1-100

  // 1. Current Percentage (Handle division by zero)
  let currentPercent = 100;
  if (c > 0) {
    currentPercent = Number(((a / c) * 100).toFixed(2));
  }

  // 2. Safe Absence Buffer
  // Formula: a / (c + x) >= p / 100 => x <= (a - (p/100)*c) / (p/100)
  let safeAbsenceBuffer = 0;
  if (c > 0 && currentPercent >= p) {
    const rawBuffer = Math.floor((a - (p / 100) * c) / (p / 100));
    safeAbsenceBuffer = Math.max(0, rawBuffer);
  }

  // 3. Recovery Calculation
  // Formula: (a + x) / (c + x) >= p / 100 => x >= ((p/100)*c - a) / (1 - p/100)
  let recoveryNeeded = 0;
  let canRecover = true;
  let projectedRecoveryPercent = currentPercent;

  if (c > 0 && currentPercent < p) {
    if (p >= 100) {
      // If 100% is required and a class has been missed (a < c), 100% can never be regained
      canRecover = false;
      recoveryNeeded = null;
    } else {
      const pRatio = p / 100;
      const rawNeeded = Math.ceil((pRatio * c - a) / (1 - pRatio));
      recoveryNeeded = Math.max(1, rawNeeded);

      const projectedA = a + recoveryNeeded;
      const projectedC = c + recoveryNeeded;
      projectedRecoveryPercent = Number(((projectedA / projectedC) * 100).toFixed(2));
    }
  }

  // 4. Status Determination (as specified in IMPLEMENTATION_PLAN.md)
  // safe: >= minPercent + 5
  // at-risk: minPercent <= currentPercent < minPercent + 5
  // critical: minPercent - 10 <= currentPercent < minPercent
  // defaulter: < minPercent - 10
  let status = 'Safe';
  let statusColor = 'green';

  if (c === 0) {
    status = 'Safe';
    statusColor = 'green';
  } else if (currentPercent >= p + 5) {
    status = 'Safe';
    statusColor = 'green';
  } else if (currentPercent >= p) {
    status = 'At Risk';
    statusColor = 'yellow';
  } else if (currentPercent >= p - 10) {
    status = 'Critical';
    statusColor = 'orange';
  } else {
    status = 'Defaulter';
    statusColor = 'red';
  }

  // 5. Transparent Rule-Based Insights
  const insights = [];

  if (c === 0) {
    insights.push({
      type: 'info',
      text: 'No attendance records logged yet for this subject.'
    });
  } else if (currentPercent >= p) {
    const diff = Number((currentPercent - p).toFixed(2));
    insights.push({
      type: 'positive',
      text: `You are ${diff}% above your configured minimum requirement (${p}%).`
    });

    if (safeAbsenceBuffer > 0) {
      insights.push({
        type: 'buffer',
        text: `Safe absence buffer: ${safeAbsenceBuffer} ${safeAbsenceBuffer === 1 ? 'class' : 'classes'}. You can miss up to this count without falling below ${p}%.`
      });
    } else {
      insights.push({
        type: 'warning',
        text: `Zero absence buffer: Missing even 1 next class will drop your attendance below ${p}%.`
      });
    }
  } else {
    const deficit = Number((p - currentPercent).toFixed(2));
    insights.push({
      type: 'alert',
      text: `Attendance is currently ${deficit}% below your configured minimum requirement (${p}%).`
    });

    if (canRecover && recoveryNeeded > 0) {
      insights.push({
        type: 'action',
        text: `Recovery action: Attend the next ${recoveryNeeded} consecutive ${recoveryNeeded === 1 ? 'class' : 'classes'} to reach ${projectedRecoveryPercent}%.`
      });
    } else if (!canRecover) {
      insights.push({
        type: 'alert',
        text: `Configured minimum is 100%. Since a class was missed, 100% cannot be mathematically recovered.`
      });
    }
  }

  // Priority consideration
  if (priority === 'high') {
    if (status !== 'Safe') {
      insights.push({
        type: 'priority',
        text: `High Priority Subject: Prioritize attending upcoming classes to avoid academic setbacks.`
      });
    } else {
      insights.push({
        type: 'priority',
        text: `High Priority Subject: Healthy buffer maintained. Keep attendance consistent.`
      });
    }
  }

  return {
    conducted: c,
    attended: a,
    currentPercent,
    minPercent: p,
    safeAbsenceBuffer,
    recoveryNeeded,
    canRecover,
    projectedRecoveryPercent,
    status,
    statusColor,
    priority,
    insights
  };
};

/**
 * Simulate attendance what-if scenario
 *
 * @param {Object} params
 * @param {number} params.conducted
 * @param {number} params.attended
 * @param {number} params.minPercent
 * @param {'miss' | 'attend'} params.type
 * @param {number} params.count
 */
export const simulateScenario = ({
  conducted = 0,
  attended = 0,
  minPercent = 75,
  type = 'miss',
  count = 1
}) => {
  const c = Math.max(0, Number(conducted) || 0);
  const a = Math.min(c, Math.max(0, Number(attended) || 0));
  const p = Math.min(100, Math.max(1, Number(minPercent) || 75));
  const n = Math.max(1, Number(count) || 1);

  let newConducted = c + n;
  let newAttended = a;

  if (type === 'attend') {
    newAttended = a + n;
  }

  const projectedPercent = Number(((newAttended / newConducted) * 100).toFixed(2));
  const currentPercent = c > 0 ? Number(((a / c) * 100).toFixed(2)) : 100;
  const differenceFromCurrent = Number((projectedPercent - currentPercent).toFixed(2));
  const differenceFromMin = Number((projectedPercent - p).toFixed(2));

  // Determine new status
  let status = 'Safe';
  if (projectedPercent >= p + 5) {
    status = 'Safe';
  } else if (projectedPercent >= p) {
    status = 'At Risk';
  } else if (projectedPercent >= p - 10) {
    status = 'Critical';
  } else {
    status = 'Defaulter';
  }

  // Calculate updated buffer if still above minimum
  let updatedBuffer = 0;
  if (projectedPercent >= p) {
    updatedBuffer = Math.max(0, Math.floor((newAttended - (p / 100) * newConducted) / (p / 100)));
  }

  // Calculate recovery needed if below minimum
  let recoveryNeeded = 0;
  if (projectedPercent < p && p < 100) {
    const pRatio = p / 100;
    recoveryNeeded = Math.max(1, Math.ceil((pRatio * newConducted - newAttended) / (1 - pRatio)));
  }

  return {
    scenario: type === 'miss' ? `Miss next ${n} classes` : `Attend next ${n} classes`,
    type,
    count: n,
    currentConducted: c,
    currentAttended: a,
    currentPercent,
    projectedConducted: newConducted,
    projectedAttended: newAttended,
    projectedPercent,
    minPercent: p,
    differenceFromCurrent,
    differenceFromMin,
    status,
    updatedBuffer,
    recoveryNeeded,
    explanation:
      type === 'miss'
        ? projectedPercent >= p
          ? `Missing ${n} classes lowers attendance to ${projectedPercent}%, which is still above ${p}%. Safe absence buffer becomes ${updatedBuffer}.`
          : `Missing ${n} classes drops attendance to ${projectedPercent}%, which is ${Math.abs(differenceFromMin)}% below ${p}%. You will need to attend ${recoveryNeeded} subsequent classes to recover.`
        : projectedPercent >= p
        ? `Attending ${n} classes raises attendance from ${currentPercent}% to ${projectedPercent}%, meeting your ${p}% requirement.`
        : `Attending ${n} classes improves attendance from ${currentPercent}% to ${projectedPercent}%, but still leaves you ${Math.abs(differenceFromMin)}% below ${p}%.`
  };
};

/**
 * Aggregate summary across all subjects for a student
 */
export const calculateOverallAttendance = (subjectSummaries = []) => {
  let totalConducted = 0;
  let totalAttended = 0;
  let criticalCount = 0;
  let atRiskCount = 0;
  let safeCount = 0;

  for (const s of subjectSummaries) {
    totalConducted += s.conducted;
    totalAttended += s.attended;
    if (s.status === 'Critical' || s.status === 'Defaulter') {
      criticalCount++;
    } else if (s.status === 'At Risk') {
      atRiskCount++;
    } else {
      safeCount++;
    }
  }

  const overallPercent =
    totalConducted > 0 ? Number(((totalAttended / totalConducted) * 100).toFixed(2)) : 100;

  let overallStatus = 'Safe';
  if (criticalCount > 0) {
    overallStatus = 'Critical';
  } else if (atRiskCount > 0) {
    overallStatus = 'At Risk';
  }

  return {
    totalSubjects: subjectSummaries.length,
    totalConducted,
    totalAttended,
    overallPercent,
    overallStatus,
    safeCount,
    atRiskCount,
    criticalCount
  };
};
