const BASE_URL = import.meta.env.VITE_API_URL || 'https://mad-coffee-backend-8oaw.onrender.com';

export const TOKEN_STORAGE_KEY = 'madcoffee_token';
export const CURRENT_USER_STORAGE_KEY = 'madcoffee_current_user';

export const DEFAULT_GAME_CONFIG = {
  sessionLengthSeconds: 180,
  spawnShiftEndsAtSeconds: 120,
  graceSeconds: 15,
  maxPauseSeconds: 120,
  minSecondsPerOrder: 5,
  maxIngredientPresses: 30,
  spawnRates: {
    student: { start: 50, end: 30 },
    elderly: { start: 30, end: 40 },
    karen: { start: 20, end: 30 },
  },
  requiredAccuracy: { student: 75, elderly: 85, karen: 95 },
  dissatisfiedPenalty: { student: 10, elderly: 15, karen: 20 },
  traceChance: { student: 10, elderly: 20, karen: 100 },
  ingredientWeight: 0.7,
  traceWeight: 0.3,
  allowedCups: ['small', 'medium', 'large', 'teacup'],
  allowedTemperatures: ['hot', 'cold'],
  allowedIngredients: ['coffee-bean', 'cream', 'milk', 'sugar', 'ice'],
  allowedTraceDesigns: ['coffee-bean', 'flower', 'heart', 'leaf', 'swan'],
};

// Local fallback recipes strictly following Section 2 of API.md:
// - 1 cup ('small', 'medium', 'large', 'teacup')
// - 1 temperature ('hot', 'cold')
// - 6 to 12 ingredient presses made from 4 distinct ingredients
// - cold recipes always include 'ice', hot recipes never include 'ice'
export const DEFAULT_RECIPES = [
  {
    id: 'local-recipe-1',
    key: 'small|hot|coffee-bean:2,cream:1,milk:2,sugar:1',
    cup: 'small',
    temperature: 'hot',
    ingredients: ['coffee-bean', 'coffee-bean', 'milk', 'milk', 'sugar', 'cream'],
  },
  {
    id: 'local-recipe-2',
    key: 'medium|hot|coffee-bean:3,cream:2,milk:2,sugar:1',
    cup: 'medium',
    temperature: 'hot',
    ingredients: ['coffee-bean', 'coffee-bean', 'coffee-bean', 'milk', 'milk', 'cream', 'cream', 'sugar'],
  },
  {
    id: 'local-recipe-3',
    key: 'large|hot|coffee-bean:4,cream:2,milk:3,sugar:2',
    cup: 'large',
    temperature: 'hot',
    ingredients: [
      'coffee-bean', 'coffee-bean', 'coffee-bean', 'coffee-bean',
      'milk', 'milk', 'milk',
      'cream', 'cream',
      'sugar', 'sugar',
    ],
  },
  {
    id: 'local-recipe-4',
    key: 'teacup|hot|coffee-bean:2,cream:1,milk:3,sugar:2',
    cup: 'teacup',
    temperature: 'hot',
    ingredients: ['coffee-bean', 'coffee-bean', 'milk', 'milk', 'milk', 'sugar', 'sugar', 'cream'],
  },
  {
    id: 'local-recipe-5',
    key: 'small|cold|coffee-bean:2,ice:2,milk:2,sugar:1',
    cup: 'small',
    temperature: 'cold',
    ingredients: ['coffee-bean', 'coffee-bean', 'ice', 'ice', 'milk', 'milk', 'sugar'],
  },
  {
    id: 'local-recipe-6',
    key: 'medium|cold|coffee-bean:3,cream:2,ice:3,milk:2',
    cup: 'medium',
    temperature: 'cold',
    ingredients: [
      'coffee-bean', 'coffee-bean', 'coffee-bean',
      'ice', 'ice', 'ice',
      'milk', 'milk',
      'cream', 'cream',
    ],
  },
  {
    id: 'local-recipe-7',
    key: 'large|cold|coffee-bean:4,cream:2,ice:4,sugar:2',
    cup: 'large',
    temperature: 'cold',
    ingredients: [
      'coffee-bean', 'coffee-bean', 'coffee-bean', 'coffee-bean',
      'cream', 'cream',
      'ice', 'ice', 'ice', 'ice',
      'sugar', 'sugar',
    ],
  },
  {
    id: 'local-recipe-8',
    key: 'teacup|cold|coffee-bean:2,cream:1,ice:2,sugar:2',
    cup: 'teacup',
    temperature: 'cold',
    ingredients: ['coffee-bean', 'coffee-bean', 'ice', 'ice', 'sugar', 'sugar', 'cream'],
  },
];

export function getStoredToken() {
  try {
    const directToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (directToken) return directToken;
    const rawUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed?.token) return parsed.token;
    }
  } catch {
    return null;
  }
  return null;
}

export function saveLogin(token, user) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearSavedLogin() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function loadSavedUser() {
  // No token means not logged in, even if an old fake user is still saved.
  if (!getStoredToken()) return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const API_TIMEOUT_MS = 90000;

export async function callApi(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };

  const authToken = token || getStoredToken();
  if (authToken) {
    headers['Authorization'] = 'Bearer ' + authToken;
  }

  // AbortController lets us cancel a request that takes too long.
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timerId);
    if (controller.signal.aborted) {
      throw { status: 0, success: false, message: 'The server took too long to respond. Please try again.' };
    }
    throw { status: 0, success: false, message: 'Could not reach the server. Please check your connection.' };
  }
  clearTimeout(timerId);

  // If the server sends something that is not JSON, we keep an empty object
  // instead of crashing.
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // The server's own message (inside data) replaces our default message.
    throw { status: response.status, success: false, message: 'Something went wrong. Please try again.', ...data };
  }

  return data;
}

export function warmUpServer() {
  return callApi('/api/health');
}

export function getRecipes() {
  return callApi('/api/recipes');
}

export function startSession() {
  return callApi('/api/sessions', 'POST');
}

export function submitOrder(sessionId, order) {
  return callApi('/api/sessions/' + sessionId + '/orders', 'POST', order);
}

export function finishSession(sessionId, reason, pausedSeconds) {
  return callApi('/api/sessions/' + sessionId + '/finish', 'PATCH', {
    reason: reason,
    pausedSeconds: pausedSeconds,
  });
}

export function getSpawnChances(elapsedSeconds, config = DEFAULT_GAME_CONFIG) {
  const shiftEnds = config?.spawnShiftEndsAtSeconds || 120;
  let progress = elapsedSeconds / shiftEnds;
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  function blend(rate) {
    return rate.start + (rate.end - rate.start) * progress;
  }

  const rates = config?.spawnRates || DEFAULT_GAME_CONFIG.spawnRates;
  return {
    student: blend(rates.student),
    elderly: blend(rates.elderly),
    karen: blend(rates.karen),
  };
}

export function pickNextCustomer(elapsedSeconds, config = DEFAULT_GAME_CONFIG, recipes = DEFAULT_RECIPES) {
  const chances = getSpawnChances(elapsedSeconds, config);
  const roll = Math.random() * 100;

  let customerType = 'karen';
  if (roll < chances.student) {
    customerType = 'student';
  } else if (roll < chances.student + chances.elderly) {
    customerType = 'elderly';
  }

  // Variant rule: 'boy' or 'girl' for student and elderly; null for karen
  const customerVariant =
    customerType === 'karen' ? null : Math.random() < 0.5 ? 'boy' : 'girl';

  // Pick a random recipe from the list
  const recipePool = Array.isArray(recipes) && recipes.length > 0 ? recipes : DEFAULT_RECIPES;
  const recipe = recipePool[Math.floor(Math.random() * recipePool.length)];

  // Latte design (tracing) rule:
  // config.traceChance.<customerType> is a percentage (student 10, elderly 20, karen 100).
  const traceChanceMap = config?.traceChance || DEFAULT_GAME_CONFIG.traceChance;
  const traceChancePct = traceChanceMap[customerType] ?? (customerType === 'karen' ? 100 : 10);
  const traceRequired =
    customerType === 'karen' ? true : Math.random() * 100 < traceChancePct;

  const allowedDesigns =
    config?.allowedTraceDesigns?.length > 0
      ? config.allowedTraceDesigns
      : DEFAULT_GAME_CONFIG.allowedTraceDesigns;

  const traceDesign = traceRequired
    ? allowedDesigns[Math.floor(Math.random() * allowedDesigns.length)]
    : null;

  return {
    id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    customerType,
    customerVariant,
    recipeId: recipe.id,
    recipe,
    traceShown: traceRequired,
    traceRequired,
    traceDesign,
    patienceRemaining: 100,
  };
}

export function evaluateOrderLocally(customer, orderPayload, config = DEFAULT_GAME_CONFIG) {
  const recipe = customer?.recipe || DEFAULT_RECIPES[0];
  const customerType = customer?.customerType || 'student';
  const requiredAccuracy =
    config?.requiredAccuracy?.[customerType] ??
    DEFAULT_GAME_CONFIG.requiredAccuracy[customerType] ??
    75;
  const penalty =
    config?.dissatisfiedPenalty?.[customerType] ??
    DEFAULT_GAME_CONFIG.dissatisfiedPenalty[customerType] ??
    10;

  const patienceRemaining = Math.max(
    0,
    Math.min(100, Math.round(orderPayload?.patienceRemaining ?? 0))
  );

  const requiredItems = [
    recipe.cup,
    recipe.temperature,
    ...(recipe.ingredients || []),
  ];

  const servedItems = [];
  if (orderPayload?.selectedCup) servedItems.push(orderPayload.selectedCup);
  if (orderPayload?.selectedTemperature) servedItems.push(orderPayload.selectedTemperature);
  if (Array.isArray(orderPayload?.selectedIngredients)) {
    servedItems.push(...orderPayload.selectedIngredients);
  }

  // Count how many served items match the recipe's items (repeated items count separately)
  const remainingRequired = [...requiredItems];
  let matchedCount = 0;
  for (const item of servedItems) {
    const idx = remainingRequired.indexOf(item);
    if (idx !== -1) {
      matchedCount += 1;
      remainingRequired.splice(idx, 1);
    }
  }

  const maxLen = Math.max(requiredItems.length, servedItems.length, 1);
  const ingredientAccuracy = Number(((matchedCount / maxLen) * 100).toFixed(1));
  const mistakeCount = Math.max(0, servedItems.length - matchedCount);

  const traceRequired =
    customerType === 'karen' ? true : Boolean(orderPayload?.traceShown || customer?.traceRequired);
  const clampedTraceScore = traceRequired
    ? Math.max(0, Math.min(100, Math.round(orderPayload?.traceScore ?? 0)))
    : null;

  const ingWeight = config?.ingredientWeight ?? 0.7;
  const trWeight = config?.traceWeight ?? 0.3;

  const combinedAccuracy = traceRequired
    ? Number((ingWeight * ingredientAccuracy + trWeight * clampedTraceScore).toFixed(1))
    : ingredientAccuracy;

  const satisfied = patienceRemaining > 0 && combinedAccuracy >= requiredAccuracy;
  const pointsEarned = satisfied ? patienceRemaining : -penalty;

  return {
    requiredAccuracy,
    ingredientAccuracy,
    mistakeCount,
    traceRequired,
    traceScore: clampedTraceScore,
    combinedAccuracy,
    patienceRemaining,
    satisfied,
    pointsEarned,
  };
}

// Builds the object that POST /api/sessions/:id/orders expects.
export function buildOrderPayload(customer, servedItems, traceScore, patienceRemaining) {
  const payload = {
    recipeId: customer.recipeId,
    customerType: customer.customerType,
    selectedCup: servedItems.selectedCup,
    selectedTemperature: servedItems.selectedTemperature,
    selectedIngredients: servedItems.selectedIngredients,
    traceShown: customer.traceRequired,
    traceScore: customer.traceRequired ? (traceScore ?? 0) : 0,
    traceDesign: customer.traceRequired ? customer.traceDesign : null,
    patienceRemaining: Math.round(patienceRemaining),
  };

  // Karen has no variant, and the server refuses one for her.
  if (customer.customerType !== 'karen') {
    payload.customerVariant = customer.customerVariant;
  }

  return payload;
}

// ----- Admin endpoints -----

export function getAdminUsers(search, limit) {
  let path = '/api/admin/users?limit=' + limit;
  if (search) {
    // encodeURIComponent makes special characters safe inside a URL.
    path = path + '&search=' + encodeURIComponent(search);
  }
  return callApi(path);
}

export function resetDisplayName(userId) {
  return callApi('/api/admin/users/' + userId + '/reset-displayname', 'PATCH');
}

export function banUser(userId) {
  return callApi('/api/admin/users/' + userId + '/ban', 'PATCH');
}

export function unbanUser(userId) {
  return callApi('/api/admin/users/' + userId + '/unban', 'PATCH');
}

export function deleteUser(userId) {
  return callApi('/api/admin/users/' + userId, 'DELETE');
}