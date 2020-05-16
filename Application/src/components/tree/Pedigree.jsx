import React, { Component } from "react";
import "./styles.css";
import DogCard from "../../components/dog";

import Tree from 'react-hierarchy-tree-graph'
import "./styles.css"; //custom styling
//import { easeElastic } from "d3-ease";

export default class Pedigree extends Component {
  //Props = data
  // constructor(props) {
  //   super(props);
  // }

  /**
   * Convert a Web3 Dog representation into a generic representation
   * used by the Tree component.
   * @param {*} dog
   */
  generateTree(dog) {

    if (!dog) return {};

    let children = [];
    let ancestorSet = new Set();
    let breeds = new Map();
    let gen = 1; //generation
    let coi = 0; //coefficient-of-inbreeding

    /* --- BASE CASE [PEDIGREE PROGENITOR] --- */
    if(dog.dam == 0 && dog.sire == 0) {
      breeds.set(dog.breed, 1);
    }

    /* --- DIVIDE AND CONQUER --- */

    //Dam Subtree
    if (dog.dam !== 0){
      let damNode = this.generateTree(dog.dam);
      children.push(damNode);

      ancestorSet.add(damNode);
      for(let ancestor of damNode.ancestors) ancestorSet.add(ancestor);

      for(let [key, value] of damNode.breedMap.entries()) {
        console.log(key + ' = ' + value)
        breeds.set(key, value/2);
      }
    }

    //Sire Subtree
    if (dog.sire !== 0) {
      let sireNode = this.generateTree(dog.sire);
      children.push(sireNode);
      ancestorSet.add(sireNode);
      for(let ancestor of sireNode.ancestors) ancestorSet.add(ancestor);
      for(let [key, value] of sireNode.breedMap.entries()) {
        let prevVal = 0; //dam breed map already had this breed
        if(breeds.has(key)) prevVal = breeds.get(key);
        breeds.set(key, prevVal + value/2);
      }
    }

    //Extend the longest pedigree generation, if no children, leave generation
    //at 0, as this current dog is a progenitor
    if(children.length !== 0) {
      gen = Math.max(children[0].generation, children[1].generation) + 1;
    }

    /* --- COMBINE --- */

    //Get the intersection between dam,sire ancestor sets
    if(children.length === 2){
      let intersection = new Set();

      //TODO there should be a better way than this
      for(let ancestor of children[0].ancestors) {
        for(let ancestor2 of children[1].ancestors){
            if(ancestor.id === ancestor2.id){
              intersection.add(ancestor);
            }
        }
      }

      if(intersection.size !== 0){
        coi = this.calculateCOI(children[0], children[1], intersection);
      }
    }

    return {
      //Key, Children for Tree Representation
      id: dog.microchipNumber,
      name: dog.name,
      children,

      //Additional Information
      contents: dog,
      coi: coi,
      generation: gen,
      ancestors: ancestorSet,
      breedMap: breeds,
    };
  }


  /**
   *  Called if sire_tree ∩ dam_tree, ∃ inbreeding. 
   *  Calculates Coefficient of  Inbreeding (COI) according to Wrights Equation
   * @param {*} dam : mother of COI target
   * @param {*} sire : father of COI target
   * @param {*} commonAncestors : set of shared ancestors between dam x sire
   */
  calculateCOI(dam, sire, commonAncestors){  
    let coi = 0;
    for (let ancestor of commonAncestors) {
        let Fa = ancestor.coi; //COI of common ancestor (CA)
        let n1 = dam.generation - ancestor.generation; //distance from dam to CA
        let n2 = sire.generation - ancestor.generation; //distance from sire to CA
        coi += Math.pow(0.5, n1 + n2 + 1.0) * (1.0 + Fa);
    }
    return coi
  }

  /**
   * Migrating calculation of breed information away from the DogCard itself.
   * 
   * Parses the 'BreedMap' which contains the consitutent breeds for a target
   * and returns data in the required format for React-Vis graphs
   * 
   * @param {*} breedMap : Map with (K,V) => (Breed_Name, Occurence_Fraction)
   */
  calculateBreedData(breedMap) {
    //TODO some sort of dynamic colour assignment to prevent multiple breeds
    //being given same colour if >5 breeds in ancestry
    let palette =[
      "#AF9164", /* GOLD */
      "#6F1A07",  /* RED */
      "#473198", /* PURPLE */
      "#F46036", /* ORANGE */
      "#ADFC92" /* GREEN */
    ];


    let breedData = [];
    var count = 0;
    for(let [key, value] of breedMap.entries()) {
      breedData.push({angle: value, color: palette[count], label: key})

      if(++count >= breedMap.size) count = 0; //prevent OOB
    }

    return breedData;
  }

  render() {
    let treeData = this.generateTree(this.props.treeRoot);
    let parsedBreedData = this.calculateBreedData(treeData.breedMap)

    return (
      <div id="wrapper_pedigree">
        <div id="tree-container" style={{width: 900, height: 700, 
        border: '1px solid grey'}}>
            <Tree
            data={treeData}
            collapsible={false}
            translate={{x: 450, y: 30}}
            zoom={0.75}
            zoomable
            separation={{siblings: 1, nonSiblings: 1}}
            pathFunc={"elbow"}
            orientation={"vertical"}/>
        </div>

        <div id="info-container">
          <DogCard 
            {...treeData}
            breedData = {parsedBreedData} 
          />
        </div>
      </div>
    );
  }
}
