const COUNTER_ID = 112836320;

export const reachGoal = (goal: string, params?: Record<string, unknown>) => {
  window.ym?.(COUNTER_ID, 'reachGoal', goal, params);
};

export default reachGoal;
