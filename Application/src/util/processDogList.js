export function computeUnions(dogs) {
  /* If there are no dogs there are no unions */
  if (dogs.length == 0) {
    return null;
  }

  const unions = [];
  let newDogs = [];
  /* For every dog... */
  dogs.forEach((dog) => {
    /* We need to add an id field to each dog for the family tree structure */
    dog.id = dog.microchipNumber;

    const parentIds = [];
    /* Find it's parents if they are defined. */
    if (dog.dam != 0) {
      parentIds.push(dog.dam);
    }
    if (dog.sire != 0) {
      parentIds.push(dog.sire);
    }

    /* If we don't have any parents then there is no union to find. */
    if (parentIds.length == 0) {
      newDogs.push(dog);
      return;
    }

    /* Attempt to find a union in the union set... */
    let union = unions.find((union) => {
      /* Which contains every element in the parentIds... */
      return parentIds.every((parent) => {
        return union.partner.includes(parent);
      });
    });
    /* If it doesn't exist then add it to the union set. */
    if (!union) {
      union = {
        id: `${parentIds[0]}u${parentIds[1]}`,
        partner: parentIds,
        children: [],
      };
      unions.push(union);
    }

    /* Add this dog to the union's children and set this dog's parent union */
    union.children.push(dog.microchipNumber);
    newDogs.push({ ...dog, parent_union: union.id });
  });
  /* Now that we've found all the unions, find own which dogs are parents in which unions */
  newDogs = findOwnUnions(newDogs, unions);

  /* Compute the links between each dog and it's unions */
  const links = computeLinks(unions);

  /* Finally we translate newDogs and unions to objects with id keys */
  const personsObject = translateToObject(newDogs);
  const unionsObject = translateToObject(unions);
  return { persons: personsObject, unions: unionsObject, links };
}

/**
 * Assign the own_union property to each dog by finding which unions it belongs to.
 * @param {Array} dogs
 * @param {Array} unions
 */
function findOwnUnions(dogs, unions) {
  const newDogs = [];
  dogs.forEach((dog) => {
    const ownUnions = unions
      .filter((union) => {
        return union.partner.includes(dog.microchipNumber);
      })
      .map((union) => {
        return union.id;
      });
    newDogs.push({ ...dog, own_unions: ownUnions });
  });
  return newDogs;
}

/**
 * Compute the links between each dog and it's unions and parent unions.
 * @param {*} unions
 */
function computeLinks(unions) {
  const links = [];
  unions.forEach((union) => {
    union.partner.forEach((partner) => {
      links.push([partner, union.id]); // Parent in union relation comes first 
    });
    union.children.forEach((child) => {
      links.push([union.id, child]); // Child in union relation comes last 
    });
  });
  return links;
}

/**
 * Translate an array to an object with the id of each array element becoming the object key.
 * @param {Array} array
 */
function translateToObject(array) {
  const obj = {};
  array.forEach((e) => {
    obj[e.id] = e;
  });
  return obj;
}
