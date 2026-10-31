import bubbleBackground from "../assets/order bubble.svg";
import hotIcon from "../assets/hot order.svg";
import coldIcon from "../assets/cold order.svg";
import latteIcon from "../assets/latte design order.svg";
import coffeeBeanIcon from "../assets/coffee bean order.svg";
import creamIcon from "../assets/cream order.svg";
import sugarIcon from "../assets/sugar order.svg";
import milkIcon from "../assets/milk order.svg";
import iceIcon from "../assets/ice order.svg";
import smallCupSvg from "../assets/small cup.svg";
import mediumCupSvg from "../assets/medium cup.svg";
import largeCupSvg from "../assets/large cup.svg";
import teacupSvg from "../assets/teacup.svg";

const INGREDIENT_ICONS = {
  "coffee-bean": coffeeBeanIcon,
  cream: creamIcon,
  milk: milkIcon,
  sugar: sugarIcon,
  ice: iceIcon,
};

const CUP_ICONS = {
  small: smallCupSvg,
  medium: mediumCupSvg,
  large: largeCupSvg,
  teacup: teacupSvg,
};

const orderBubbleStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap');

/* Everything inside uses cqw: 1cqw = 1% of the bubble's own width. */
.order-bubble {
  position: absolute;
  left: calc(321 / 1440 * 100%);
  top: calc(40 / 1024 * 100%);
  width: calc(433 / 1440 * 100%);
  aspect-ratio: 328 / 270;
  z-index: 12;
  container-type: inline-size;
  pointer-events: none;
  user-select: none;
}

.order-bubble-bg {
  width: 100%;
  height: 100%;
  display: block;
}

.order-bubble-number {
  position: absolute;
  left: 8.5cqw;
  top: 7cqw;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 5.5cqw;
  line-height: 1;
  color: #361E10;
}

.order-bubble-items {
  position: absolute;
  left: 8cqw;
  right: 8cqw;
  top: 13cqw;
  height: 34.5cqw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: 3cqw;
}

/* Each icon SVG already includes its own tile and border. */
.order-item {
  position: relative;
    width: 15.5cqw;
  flex-shrink: 0;
}

.order-item img {
  display: block;
  width: 100%;
  height: auto;
}

/* Green tint. The mask cuts it to the shape of the icon's tile. */
.order-item-tint {
  position: absolute;
  inset: 0;
  background: #BFE08F;
  mix-blend-mode: multiply;
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.order-item.is-done .order-item-tint {
  opacity: 1;
}

/* Cups have no tile in their pictures, so we draw one. */
.order-item.is-cup {
  box-sizing: border-box;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5E4BF;
  border: 1.2cqw solid #361E10;
  border-radius: 3.4cqw;
  transition: background-color 0.2s ease;
}

.order-item.is-cup.is-done {
  background: #B5C665;
}

.order-item.is-cup img {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.order-badge {
  position: absolute;
  right: -2cqw;
  bottom: -2cqw;
  width: 7cqw;
  height: 7cqw;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #361E10;
  color: #FFFFFF;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 4.4cqw;
  line-height: 1;
}

.order-badge.is-check {
  background: #4E8F2F;
}
.order-bubble-timer {
  position: absolute;
  left: 10cqw;
  right: 10cqw;
  top: 50cqw;
  height: 5cqw;
  display: flex;
  align-items: center;
  gap: 2.5cqw;
}

.order-timer-track {
  box-sizing: border-box;
  flex: 1;
  height: 100%;
  background: #361E10;
  border: 0.8cqw solid #361E10;
  border-radius: 999px;
  overflow: hidden;
}

.order-timer-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.2s linear, background-color 0.3s ease;
}

.order-timer-text {
  min-width: 9cqw;
  text-align: right;
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 4.4cqw;
  line-height: 1;
  color: #361E10;
}`;

// Turns the customer's recipe into a list of tiles for the bubble.
// "isDone" is worked out from what the player has served so far.
function buildItems(customer, servedItems, traceScore) {
  const recipe = customer.recipe;
  const items = [];

  // Cup (delete this block to hide the cup tile)
  items.push({
    key: "cup",
    icon: CUP_ICONS[recipe.cup],
    quantity: 1,
    isCup: true,
    isDone: servedItems.selectedCup === recipe.cup,
  });

  // Temperature
  items.push({
    key: "temperature",
    icon: recipe.temperature === "hot" ? hotIcon : coldIcon,
    quantity: 1,
    isDone: servedItems.selectedTemperature === recipe.temperature,
  });

  // Ingredients: count how many times each one is needed.
  const neededCounts = {};
  for (const name of recipe.ingredients) {
    neededCounts[name] = (neededCounts[name] || 0) + 1;
  }

  for (const name of Object.keys(neededCounts)) {
    // Count how many times the player has pressed this ingredient.
    let servedCount = 0;
    for (const pressed of servedItems.selectedIngredients) {
      if (pressed === name) servedCount += 1;
    }

    items.push({
      key: name,
      icon: INGREDIENT_ICONS[name],
      quantity: neededCounts[name],
      isDone: servedCount >= neededCounts[name],
    });
  }

  // Latte design, only for customers who asked for one.
  if (customer.traceRequired) {
    items.push({
      key: "latte",
      icon: latteIcon,
      quantity: 1,
      isDone: traceScore !== null,
    });
  }

  return items;
}

// Green while there is plenty of time, then yellow, then red.
function getPatienceColor(patience) {
  if (patience > 50) return "#7FA832";
  if (patience > 25) return "#E0A93B";
  return "#C0392B";
}

function OrderBubble({
  customer,
  servedItems,
  traceScore,
  orderNumber,
  patience,
  secondsLeft,
}) {
  const items = buildItems(customer, servedItems, traceScore);

  return (
    <>
      <style>{orderBubbleStyles}</style>

      <div className="order-bubble" aria-label={"Order number " + orderNumber}>
        <img
          className="order-bubble-bg"
          src={bubbleBackground}
          alt=""
          draggable="false"
        />
        <div className="order-bubble-number">Order #{orderNumber}</div>
        <div className="order-bubble-items">
          {items.map((item) => {
            let className = "order-item";
            if (item.isCup) className += " is-cup";
            if (item.isDone) className += " is-done";

            return (
              <div key={item.key} className={className}>
                <img src={item.icon} alt="" draggable="false" />
                {/* Green tint, only for icons that bring their own tile. */}
                {!item.isCup && (
                  <span
                    className="order-item-tint"
                    style={{
                      maskImage: 'url("' + item.icon + '")',
                      WebkitMaskImage: 'url("' + item.icon + '")',
                    }}
                  />
                )}

                {item.isDone && <span className="order-badge is-check">✓</span>}
                {!item.isDone && item.quantity > 1 && (
                  <span className="order-badge">{item.quantity}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="order-bubble-timer">
          <div className="order-timer-track">
            <div
              className="order-timer-fill"
              style={{
                width: patience + "%",
                background: getPatienceColor(patience),
              }}
            />
          </div>
          <span className="order-timer-text">{secondsLeft}s</span>
        </div>
      </div>
    </>
  );
}

export default OrderBubble;
