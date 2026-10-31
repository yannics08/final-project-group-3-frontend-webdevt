import { useState } from 'react';
import { DEFAULT_GAME_CONFIG } from '../services/api';

// The cup shelf uses short codes. The server wants full names.
const CUP_NAMES = {
  S: 'small',
  M: 'medium',
  L: 'large',
  teacup: 'teacup',
};

// Machine buttons that add an ingredient. (The water buttons and the
// latte design button are handled separately.)
const INGREDIENT_BUTTONS = ['coffee-bean', 'cream', 'milk', 'sugar', 'ice'];

export function useOrder(config) {
  const [cupCode, setCupCode] = useState(null);         // 'S', 'M', 'L', 'teacup' or null
  const [temperature, setTemperature] = useState(null);  // null, 'hot' or 'cold'
  const [ingredients, setIngredients] = useState([]);    // for example ['coffee-bean', 'milk']
  const [traceDesign, setTraceDesign] = useState(null);  // the design that was traced
  const [traceScore, setTraceScore] = useState(null);    // null until the trace is done

  const maxPresses = config?.maxIngredientPresses ?? DEFAULT_GAME_CONFIG.maxIngredientPresses;

  // Once any machine button has been pressed, the cup can no longer change.
  const cupIsLocked = temperature !== null || ingredients.length > 0;

  function chooseCup(code) {
    if (cupIsLocked) return;
    setCupCode(code);
  }

  // Returns true if the press was accepted, false if it was ignored.
  function pressButton(buttonName) {
    if (!cupCode) return false;

    // Water buttons set the temperature. The first press is final.
    if (buttonName === 'hot-water' || buttonName === 'cold-water') {
      if (temperature !== null) return false;
      setTemperature(buttonName === 'hot-water' ? 'hot' : 'cold');
      return true;
    }

    // Ingredient buttons add one press to the list.
    if (INGREDIENT_BUTTONS.includes(buttonName)) {
      if (ingredients.length >= maxPresses) return false;
      setIngredients([...ingredients, buttonName]);
      return true;
    }

    return false;
  }

  // Called when the player finishes the latte design.
  function saveTrace(design, score) {
    setTraceDesign(design);
    setTraceScore(score);
  }

  function resetOrder() {
    setCupCode(null);
    setTemperature(null);
    setIngredients([]);
    setTraceDesign(null);
    setTraceScore(null);
  }

  // The three values the server needs, with the cup name converted.
  function getServedItems() {
    return {
      selectedCup: cupCode ? CUP_NAMES[cupCode] : null,
      selectedTemperature: temperature,
      selectedIngredients: ingredients,
    };
  }

  return {
    cupCode: cupCode,
    cupIsLocked: cupIsLocked,
    traceDesign: traceDesign,
    traceScore: traceScore,
    chooseCup: chooseCup,
    pressButton: pressButton,
    saveTrace: saveTrace,
    resetOrder: resetOrder,
    getServedItems: getServedItems,
  };
}