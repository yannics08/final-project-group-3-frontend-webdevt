const BUTTON_PANEL_WIDTH = 440;
const BUTTON_PANEL_HEIGHT = 237.98;

function IngredientButton({ button, onPress, disabled }) {
  const { ingredient, label, left, top, iconSrc } = button;

  const position = {
    left: `${(left / BUTTON_PANEL_WIDTH) * 100}%`,
    top: `${(top / BUTTON_PANEL_HEIGHT) * 100}%`,
  };

  return (
    <button
      type="button"
      className="cm-btn"
      style={position}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onPress(ingredient);
      }}
      aria-label={label}
      title={disabled ? "Select a cup first" : label}
    >
      <img src={iconSrc} alt="" draggable="false" />
    </button>
  );
}

export default IngredientButton;
