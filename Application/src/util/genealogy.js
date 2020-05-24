/**
 * Compute additional genealogy properties of a dog.
 * @param {*} dog
 */
export function computeGenealogy(dog) {
  if (!dog) return {};

  let children = [];
  let ancestorSet = new Set();
  let breeds = new Map();
  let gen = 1; //generation
  let coi = 0; //coefficient-of-inbreeding

  /* --- BASE CASE [PEDIGREE PROGENITOR] --- */
  if (Number(dog.dam) === 0 && Number(dog.sire) === 0) {
    breeds.set(dog.breed, 1);
  }

  /* --- DIVIDE AND CONQUER --- */

  //Dam Subtree
  if (Number(dog.dam) !== 0) {
    let damNode = computeGenealogy(dog.dam);
    children.push(damNode);

    ancestorSet.add(damNode);
    for (let ancestor of damNode.ancestors) ancestorSet.add(ancestor);

    for (let [key, value] of damNode.breedMap.entries()) {
      breeds.set(key, value / 2);
    }
  }

  //Sire Subtree
  if (dog.sire !== 0) {
    let sireNode = computeGenealogy(dog.sire);
    children.push(sireNode);
    ancestorSet.add(sireNode);
    for (let ancestor of sireNode.ancestors) ancestorSet.add(ancestor);
    for (let [key, value] of sireNode.breedMap.entries()) {
      let prevVal = 0; //dam breed map already had this breed
      if (breeds.has(key)) prevVal = breeds.get(key);
      breeds.set(key, prevVal + value / 2);
    }
  }

  //Extend the longest pedigree generation, if no children, leave generation
  //at 0, as this current dog is a progenitor
  if (children.length === 2) {
    gen = Math.max(children[0].generation, children[1].generation) + 1;
  } else if (children.length === 1) {
    gen = children[0].generation + 1;
  }

  /* --- COMBINE --- */

  //Get the intersection between dam,sire ancestor sets
  if (children.length === 2) {
    let intersection = new Set();

    //TODO there should be a better way than this
    for (let ancestor of children[0].ancestors) {
      for (let ancestor2 of children[1].ancestors) {
        if (ancestor.microchipNumber === ancestor2.microchipNumber) {
          intersection.add(ancestor);
        }
      }
    }

    if (intersection.size !== 0) {
      coi = calculateCOI(children[0], children[1], intersection);
    }
  }

  return {
    // Get all the original properties of the dog.
    ...dog,

    //Additional Information
    coi: coi,
    generation: gen,
    ancestors: ancestorSet,
    breedMap: breeds,
  };
}

/**
 *  Called if sire_tree ∩ dam_tree, ∃ inbreeding.
 *  Calculates Coefficient of  Inbreeding (COI) according to Wrights Equation
 * https://www.instituteofcaninebiology.org/blog/coi-faqs-understanding-the-coefficient-of-inbreeding
 * @param {*} dam : mother of COI target
 * @param {*} sire : father of COI target
 * @param {*} commonAncestors : set of shared ancestors between dam x sire
 */
export function calculateCOI(dam, sire, commonAncestors) {
  let coi = 0;
  for (let ancestor of commonAncestors) {
    console.log("coi calc: " + ancestor.microchipNumber + "||" + ancestor.coi);
    let Fa = ancestor.coi; //COI of common ancestor (CA)
    let n1 = dam.generation - ancestor.generation; //distance from dam to CA
    let n2 = sire.generation - ancestor.generation; //distance from sire to CA
    coi += Math.pow(0.5, n1 + n2 + 1.0) * (1.0 + Fa);
    console.log("FA:" + Fa + ", n1:" + n1 + ", n2:" + n2 + "=" + coi);
  }
  return coi;
}

/**
 * Parses the 'BreedMap' which contains the consitutent breeds for a target
 * and returns data in the required format for React-Vis graphs
 *
 * @param {*} breedMap : Map with (K,V) => (Breed_Name, Occurence_%)
 */
export function calculateBreedData(breedMap) {
  //TODO some sort of dynamic colour assignment to prevent multiple breeds
  //being given same colour if >5 breeds in ancestry
  let palette = [
    /* https://www.color-hex.com/color-palette/61647 */
    "#867676",
    "#836946",
    "#CFBFAF",
    "#443633",
    "#6a4a3f",

    "#AF9164" /* GOLD */,
    "#6F1A07" /* RED */,
    "#473198" /* PURPLE */,
    "#F46036" /* ORANGE */,
    "#ADFC92" /* GREEN */,
  ];

  let breedData = [];
  var count = 0;
  for (let [key, value] of breedMap.entries()) {
    breedData.push({ angle: value * 100, color: palette[count], label: key });

    if (++count >= breedMap.size) count = 0; //prevent OOB
  }

  return breedData;
}
