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

    if (dog.dam != 0) children.push(this.generateTree(dog.dam));
    if (dog.sire != 0) children.push(this.generateTree(dog.sire));

    return {
      id: dog.microchipNumber,
      children,
      content: dog,
    };
  }

  /**
   * Traverse a tree and generate breed/inbreeding/genetic info
   */
  traverseTree(dog) {
    let tree = this.generateTree(this.props.treeRoot);
  }

  render() {
    let tree = this.generateTree(this.props.treeRoot);

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
            data={this.generateTree(this.props.treeRoot)}
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
          <DogCard {...this.props.treeRoot} />
        </div>
      </div>
    );
  }
}
