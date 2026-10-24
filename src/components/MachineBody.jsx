import coffeeMachineSvg from '../assets/coffee machine.svg';
import NozzleDispense from './NozzleDispense';

function MachineBody({ dispenseEvent }) {
  return (
    <>
      <img
        className="coffee-machine-svg"
        src={coffeeMachineSvg}
        alt=""
        draggable="false"
      />
      {dispenseEvent && (
        <svg
          className="coffee-machine-dispense-svg"
          viewBox="0 0 584 709"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <NozzleDispense dispenseEvent={dispenseEvent} />
        </svg>
      )}
    </>
  );
}

export default MachineBody;
