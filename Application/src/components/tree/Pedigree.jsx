import React, { Component } from "react";
import "./styles.css";
import DogCard from "../../components/dog";
import Tree from "react-tree-graph"; //SVG Tree Structure

//import 'react-tree-graph/dist/style.css' //Default Tree Styling

//TODO investigate alternative
// https://www.npmjs.com/package/react-hierarchy-tree-graph?activeTab=readme

import "./styles.css"; //custom styling
import { easeElastic } from "d3-ease";

export default class Pedigree extends Component {
  //Props = data
  constructor(props) {
    super(props);
  }

  /**
   * Convert a Web3 Dog representation into a generic representation
   * used by the Tree component.
   * @param {*} dog
   */
  generateTree(dog) {

    if (!dog) return {};

    let children = [];
    let ancestorSet = new Set();
    let gen = 1; //generation
    let coi = 0;

    /* BASE CASES*/


    /* DIVIDE AND CONQUER */

    //Dam Subtree
    if (dog.dam != 0){
      let damNode = this.generateTree(dog.dam);
      children.push(damNode);
      
      ancestorSet.add(damNode);
      for(let ancestor of damNode.ancestors) ancestorSet.add(ancestor);
    }

    //Sire Subtree
    if (dog.sire != 0) {
      let sireNode = this.generateTree(dog.sire);
      children.push(sireNode);

      ancestorSet.add(sireNode);
      for(let ancestor of sireNode.ancestors) ancestorSet.add(ancestor);
    }

    //Extend the longest pedigree generation, if no children, leave generation
    //at 0, as this current dog is a progenitor
    if(children.length != 0) {
      gen = Math.max(children[0].generation, children[1].generation) + 1;
    }

    /* COMBINE */

    //Get the intersection between dam,sire ancestor sets
    if(children.length == 2){
      let intersection = new Set();

      //there should be a better way than this
      for(let ancestor of children[0].ancestors) {
        for(let ancestor2 of children[1].ancestors){
            if(ancestor.id == ancestor2.id){
              intersection.add(ancestor);
            }
        }
      }

      if(intersection.size != 0){
        coi = this.calculateCOI(children[0], children[1], intersection);
      }
    }

    //Calculate COI

    return {
      //Key, Children for Tree Representation
      id: dog.microchipNumber,
      children,

      //Additional Information
      content: dog,
      inbredcoef: coi,
      generation: gen,
      ancestors: ancestorSet,
    };
  }


  calculateCOI(dam, sire, commonAncestors){

    //if sire_tree ∩ dam_tree, ∃ inbreeding. Calculate Coefficient of Inbreeding (COI)
    
    let coi = 0;
    for (let ancestor of commonAncestors) {
        let Fa = ancestor.inbredcoef;
        
        let n1 = dam.generation - ancestor.generation; //distance from dam to CA
        let n2 = sire.generation - ancestor.generation; //distance from sire to CA
      
        coi += Math.pow(0.5, n1 + n2 + 1.0) * (1.0 + Fa);
    }

    return coi
  }


  calculateBreed(ancestors){
    let breedMap = new Map();
    //alert(ancestors.size)

    for(let ancestor in ancestors){
      //alert(ancestor.content.breed);
      if(breedMap.has(ancestor.content.breed)){
        breedMap.set(ancestor.content.breed, 
          breedMap.get(ancestor.content.breed) + 1);
      } else {
        breedMap.set(ancestor.content.breed, 1);
      }
    }

    breedMap.set("hello", 2);
    //alert(breedMap.toJSON);
    return breedMap;
  }

  render() {
    let treeData = this.generateTree(this.props.treeRoot);

    const data2 = {
      name: "Parent",
      children: [
        {
          name: "Child One",
        },
        {
          name: "Child Two",
        },
      ],
    };

    return (
      <div id="wrapper_pedigree">
        <div id="tree-container">
          <Tree
            data={treeData}
            height={700}
            width={900}
            nodeRadius={0}
            keyProp={"id"}
            labelProp={"id"}
            svgProps={{
              className: "custom",
              //transform: 'rotate(90)'
            }}
          />
        </div>

        <div id="info-container">
          <DogCard {...treeData.content} 
          generation={treeData.generation}
          ancestors = {treeData.ancestors}
          coi = {treeData.inbredcoef}
          breed = {this.calculateBreed(treeData.ancestors)} />
        </div>
      </div>
    );
  }
}
