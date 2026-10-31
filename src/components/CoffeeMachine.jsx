import { useState, useEffect } from 'react';
import MachineBody from './MachineBody';
import IngredientButton from './IngredientButton';
import { nozzleDispenseStyles } from './NozzleDispense';
import {
  hotWaterButtonSvg,
  coldWaterButtonSvg,
  iceButtonSvg,
  milkButtonSvg,
  sugarButtonSvg,
  coffeeBeanButtonSvg,
  creamButtonSvg,
  latteDesignButtonSvg,
} from './ButtonIcons';

const styles = `
.coffee-machine {
  position: absolute;
  left: calc(800 / 1440 * 100%);
  top: calc(45 / 1024 * 100%);
  width: calc(517 / 1440 * 100%);
  aspect-ratio: 517 / 641;
  z-index: 10;
  pointer-events: none;
  user-select: none;
}

.coffee-machine-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.cm-buttons-panel {
  position: absolute;
  left: calc(38.5 / 517 * 100%);
  top: 0;
  width: calc(440 / 517 * 100%);
  height: calc(237.98 / 641 * 100%);
  pointer-events: none;
}

.cm-btn {
  position: absolute;
  width: calc(76 / 440 * 100%);
  aspect-ratio: 1 / 1;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  pointer-events: auto;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.cm-btn img,
.cm-btn svg {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  user-select: none;
}

.cm-btn:not(:disabled):hover {
  transform: scale(1.05);
  filter: brightness(1.04);
}

.cm-btn:not(:disabled):active {
  transform: scale(0.95);
  filter: brightness(0.95);
}

.cm-btn:disabled {
  cursor: not-allowed;
}
`;

const BUTTONS = [
  { ingredient: "hot-water", label: "Hot Water", left: 26, top: 26, iconSrc: hotWaterButtonSvg },
  { ingredient: "cold-water", label: "Cold Water", left: 129, top: 26, iconSrc: coldWaterButtonSvg },
  { ingredient: "ice", label: "Ice", left: 233, top: 26, iconSrc: iceButtonSvg },
  { ingredient: "milk", label: "Milk", left: 338, top: 26, iconSrc: milkButtonSvg },
  { ingredient: "sugar", label: "Sugar", left: 26, top: 116, iconSrc: sugarButtonSvg },
  { ingredient: "coffee-bean", label: "Coffee Bean", left: 129, top: 116, iconSrc: coffeeBeanButtonSvg },
  { ingredient: "cream", label: "Whipped Cream", left: 233, top: 116, iconSrc: creamButtonSvg },
  { ingredient: "latte-design", label: "Latte Design", left: 338, top: 116, iconSrc: latteDesignButtonSvg },
];

function CoffeeMachine({selectedCup, onIngredientClick }) {
  const [dispenseEvent, setDispenseEvent] = useState(null);

  useEffect(() => {
    if (!dispenseEvent) return undefined;
    const timer = setTimeout(() => {
      setDispenseEvent(null);
    }, 1050);
    return () => clearTimeout(timer);
  }, [dispenseEvent]);

  const handlePress = (ingredient) => {
    if (!selectedCup) return;

    // Ask the game screen first. It answers false if the press was ignored.
    let accepted = true;
    if (onIngredientClick) {
      accepted = onIngredientClick(ingredient) !== false;
    }

    // Only play the dispense animation for presses that counted.
    if (accepted && ingredient !== "latte-design") {
      setDispenseEvent({ id: Date.now(), ingredient, cupType: selectedCup });
    }
  };

  return (
    <>
      <style>{styles + nozzleDispenseStyles}</style>

      <div className="coffee-machine" aria-label="Coffee Machine">
        <MachineBody dispenseEvent={dispenseEvent} />

        <div className="cm-buttons-panel">
          {BUTTONS.map((button) => (
            <IngredientButton
              key={button.ingredient}
              button={button}
              disabled={!selectedCup}
              onPress={handlePress}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CoffeeMachine;
