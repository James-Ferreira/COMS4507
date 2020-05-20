/**
 * Convert a Web3 Dog representation into a representation used by the AncestryGraph component.
 * @param {Object} dog
 */
export default function dogToTree(dog) {
  const data = tabulate(dog);
  return Array.from(new Set(data.map((e) => e.id))).map((id) => {
    return { id, parentIds: data.find((e) => e.id === id).parentIds };
  });
}

/**
 * Recursively build the array of node links.
 * @param {Object} dog
 */
function tabulate(dog) {
  if (!dog) return {};
  let parentIds = [];
  let damTree = [];
  let sireTree = [];
  if (dog.dam != 0) {
    parentIds.push(dog.dam.microchipNumber);
    damTree = dogToTree(dog.dam);
  }
  if (dog.sire != 0) {
    parentIds.push(dog.sire.microchipNumber);
    sireTree = dogToTree(dog.sire);
  }

  return [
    {
      id: dog.microchipNumber,
      parentIds,
    },
    ...damTree,
    ...sireTree,
  ];
}

/**
 * Push an {element} to the {array} if another object with the same {propertyName} doesn't exist already.
 * @param {Array} array
 * @param {Object} element
 * @param {String} propertyName
 */
function pushUnique(array, element, propertyName) {
  const unique = !array.some((e) => {
    return e.id == element[propertyName];
  });

  if (unique) array.push(element);
}
