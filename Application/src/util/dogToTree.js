/**
 * Convert a Web3 Dog representation into a generic representation used by the Tree component.
 * @param {*} dog 
 */
export default function dogToTree(dog) {
  if (!dog) return {};
  let children = [];
  if (dog.dam != 0) children.push(dogToTree(dog.dam));
  if (dog.sire != 0) children.push(dogToTree(dog.sire));
  return {
    content: dog.name,
    children,
  };
}
