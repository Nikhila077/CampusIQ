import {
  calculateSubjectMetrics,
  simulateScenario,
  calculateOverallAttendance
} from './src/services/attendanceEngine.js';

console.log('=== RUNNING SMART ATTENDANCE ENGINE TEST CASES ===\n');

// Test Case 1: 0 conducted
const tc1 = calculateSubjectMetrics({ conducted: 0, attended: 0, minPercent: 75 });
console.log('TC1: 0 conducted, 0 attended:');
console.log(`  Current %: ${tc1.currentPercent}%, Buffer: ${tc1.safeAbsenceBuffer}, Recovery: ${tc1.recoveryNeeded}, Status: ${tc1.status}`);
console.assert(tc1.currentPercent === 100, 'TC1 failed: percentage should be 100% or default');
console.assert(tc1.safeAbsenceBuffer === 0, 'TC1 failed: buffer should be 0');
console.assert(tc1.status === 'Safe', 'TC1 failed: status should be Safe');

// Test Case 2: Above minimum (Example from spec: 21 attended, 25 conducted, min 75%)
// 21 / (25 + 3) = 21 / 28 = 75% => buffer = 3
const tc2 = calculateSubjectMetrics({ conducted: 25, attended: 21, minPercent: 75 });
console.log('\nTC2: 21/25 attended (84%), min 75%:');
console.log(`  Current %: ${tc2.currentPercent}%, Buffer: ${tc2.safeAbsenceBuffer}, Recovery: ${tc2.recoveryNeeded}, Status: ${tc2.status}`);
console.assert(tc2.currentPercent === 84, 'TC2 failed: percentage should be 84%');
console.assert(tc2.safeAbsenceBuffer === 3, `TC2 failed: buffer should be 3, got ${tc2.safeAbsenceBuffer}`);
console.assert(tc2.status === 'Safe', 'TC2 failed: status should be Safe');

// Test Case 3: Exactly minimum (e.g. 15/20 = 75%, min 75%)
// Buffer must be 0!
const tc3 = calculateSubjectMetrics({ conducted: 20, attended: 15, minPercent: 75 });
console.log('\nTC3: 15/20 attended (75%), min 75%:');
console.log(`  Current %: ${tc3.currentPercent}%, Buffer: ${tc3.safeAbsenceBuffer}, Status: ${tc3.status}`);
console.assert(tc3.currentPercent === 75, 'TC3 failed: percentage should be 75%');
console.assert(tc3.safeAbsenceBuffer === 0, `TC3 failed: buffer should be 0, got ${tc3.safeAbsenceBuffer}`);
console.assert(tc3.status === 'At Risk', `TC3 failed: status should be At Risk (since not >= 75+5), got ${tc3.status}`);

// Test Case 4: Below minimum (e.g. 10/20 = 50%, min 75%)
// Recovery formula: ((0.75 * 20) - 10) / (1 - 0.75) = (15 - 10) / 0.25 = 20 classes!
// Check: (10 + 20) / (20 + 20) = 30 / 40 = 75%
const tc4 = calculateSubjectMetrics({ conducted: 20, attended: 10, minPercent: 75 });
console.log('\nTC4: 10/20 attended (50%), min 75%:');
console.log(`  Current %: ${tc4.currentPercent}%, Buffer: ${tc4.safeAbsenceBuffer}, Recovery: ${tc4.recoveryNeeded}, Status: ${tc4.status}`);
console.assert(tc4.currentPercent === 50, 'TC4 failed: percentage should be 50%');
console.assert(tc4.safeAbsenceBuffer === 0, 'TC4 failed: buffer should be 0');
console.assert(tc4.recoveryNeeded === 20, `TC4 failed: recoveryNeeded should be 20, got ${tc4.recoveryNeeded}`);
console.assert(tc4.status === 'Defaulter', `TC4 failed: status should be Defaulter (< 65%), got ${tc4.status}`);

// Test Case 5: 100% attendance (e.g. 10/10, min 75%)
// (10 - 0.75 * 10) / 0.75 = 2.5 / 0.75 = 3.33 => buffer = 3
// Check: 10 / 13 = 76.9% >= 75%. 10 / 14 = 71.4% < 75%.
const tc5 = calculateSubjectMetrics({ conducted: 10, attended: 10, minPercent: 75 });
console.log('\nTC5: 10/10 attended (100%), min 75%:');
console.log(`  Current %: ${tc5.currentPercent}%, Buffer: ${tc5.safeAbsenceBuffer}`);
console.assert(tc5.safeAbsenceBuffer === 3, `TC5 failed: buffer should be 3, got ${tc5.safeAbsenceBuffer}`);

// Test Case 6: Minimum = 100% requirement with missed class
const tc6 = calculateSubjectMetrics({ conducted: 10, attended: 9, minPercent: 100 });
console.log('\nTC6: 9/10 attended, min 100%:');
console.log(`  Current %: ${tc6.currentPercent}%, canRecover: ${tc6.canRecover}, Recovery: ${tc6.recoveryNeeded}`);
console.assert(tc6.canRecover === false, 'TC6 failed: canRecover should be false when 100% missed');

// Test Case 7: What-If simulation - miss next 2 classes from 21/25 (84%)
const sim1 = simulateScenario({ conducted: 25, attended: 21, minPercent: 75, type: 'miss', count: 2 });
console.log('\nTC7: What-If Miss 2 classes from 21/25:');
console.log(`  Projected %: ${sim1.projectedPercent}%, Updated Buffer: ${sim1.updatedBuffer}, Status: ${sim1.status}`);
// 21 / 27 = 77.78%, buffer should be 1
console.assert(sim1.projectedPercent === 77.78, `TC7 failed: projected % should be 77.78, got ${sim1.projectedPercent}`);
console.assert(sim1.updatedBuffer === 1, `TC7 failed: updated buffer should be 1, got ${sim1.updatedBuffer}`);

// Test Case 8: What-If simulation - attend next 4 classes from 10/20 (50%)
const sim2 = simulateScenario({ conducted: 20, attended: 10, minPercent: 75, type: 'attend', count: 4 });
console.log('\nTC8: What-If Attend 4 classes from 10/20:');
console.log(`  Projected %: ${sim2.projectedPercent}%, Status: ${sim2.status}`);
// 14 / 24 = 58.33%
console.assert(sim2.projectedPercent === 58.33, `TC8 failed: projected % should be 58.33, got ${sim2.projectedPercent}`);

console.log('\n>>> ALL ATTENDANCE ENGINE UNIT TESTS PASSED SUCCESSFULLY! <<<');
