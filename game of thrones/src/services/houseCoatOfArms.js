
export const HOUSE_COAT_OF_ARMS = {
  'House Stark of Winterfell': '/coat-of-arms/stark.png',
  'House Lannister of Casterly Rock': '/coat-of-arms/lannister.png',
  'House Targaryen of King\'s Landing': '/coat-of-arms/targaryen.png',
  'House Baratheon of Storm\'s End': '/coat-of-arms/baratheon.png',
  'House Greyjoy of Pyke': '/coat-of-arms/greyjoy.png',
  'House Tyrell of Highgarden': '/coat-of-arms/tyrell.png',
  'House Martell of Sunspear': '/coat-of-arms/martell.png',
  'House Tully of Riverrun': '/coat-of-arms/tully.png',
  'House Arryn of the Eyrie': '/coat-of-arms/arryn.png',
  'House Bolton of the Dreadfort': '/coat-of-arms/bolton.png',
};

export const getCoatOfArms = (houseName) => {
  
  const match = Object.keys(HOUSE_COAT_OF_ARMS).find(
    (key) => houseName.includes(key) || key.includes(houseName)
  );
  return match ? HOUSE_COAT_OF_ARMS[match] : null;
};