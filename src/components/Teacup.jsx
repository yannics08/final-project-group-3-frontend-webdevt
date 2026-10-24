import teacupSvg from '../assets/teacup.svg';

function Teacup({ className = "", style, onClick }) {
  return (
    <button
      type="button"
      className={`teacup-btn ${className}`}
      style={style}
      onClick={() => onClick && onClick("teacup")}
      aria-label="Teacup"
      title="Teacup"
    >
      <img src={teacupSvg} alt="" draggable="false" />
    </button>
  );
}

export default Teacup;
