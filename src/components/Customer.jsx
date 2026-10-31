import boyDefault from '../assets/boy--default.svg';
import boyHappy from '../assets/boy--happy.svg';
import boyMad from '../assets/boy--mad.svg';
import girlDefault from '../assets/girl--default.svg';
import girlHappy from '../assets/girl--happy.svg';
import girlMad from '../assets/girl--mad.svg';
import grandpaDefault from '../assets/grandpa--default.svg';
import grandpaHappy from '../assets/grandpa--happy.svg';
import grandpaMad from '../assets/grandpa--mad.svg';
import grandmaDefault from '../assets/grandma--default.svg';
import grandmaHappy from '../assets/grandma--happy.svg';
import grandmaMad from '../assets/grandma--mad.svg';
import karenDefault from '../assets/karen--default.svg';
import karenHappy from '../assets/karen--happy.svg';
import karenMad from '../assets/karen--mad.svg';

// Which picture to show: first the character, then the mood.
const CUSTOMER_IMAGES = {
  boy: { default: boyDefault, happy: boyHappy, mad: boyMad },
  girl: { default: girlDefault, happy: girlHappy, mad: girlMad },
  grandpa: { default: grandpaDefault, happy: grandpaHappy, mad: grandpaMad },
  grandma: { default: grandmaDefault, happy: grandmaHappy, mad: grandmaMad },
  karen: { default: karenDefault, happy: karenHappy, mad: karenMad },
};

const customerStyles = `
.customer-btn {
  position: absolute;
  left: calc(66 / 1440 * 100%);
  bottom: calc((1024 - 630) / 1024 * 100%);
  width: calc(330 / 1440 * 100%);
  height: calc(420 / 1024 * 100%);
  overflow: hidden;
  z-index: 8;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  outline: none;
  pointer-events: none;
  user-select: none;
  animation: customerArrive 0.25s ease-out;
  transition: filter 0.15s ease;
}

.customer-btn img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
  user-select: none;
}

@keyframes customerArrive {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`;

// The API has student / elderly / karen. The pictures have 5 characters.
function getCharacterName(customerType, customerVariant) {
  if (customerType === 'karen') return 'karen';
  if (customerType === 'student') return customerVariant; // 'boy' or 'girl'
  // elderly
  return customerVariant === 'boy' ? 'grandpa' : 'grandma';
}

function Customer({ customerType, customerVariant, mood }) {
  const characterName = getCharacterName(customerType, customerVariant);
  const imageSrc = CUSTOMER_IMAGES[characterName][mood];

  return (
    <>
      <style>{customerStyles}</style>

      <div className="customer-btn">
        <img src={imageSrc} alt="" draggable="false" />
      </div>
    </>
  );
}

export default Customer;
