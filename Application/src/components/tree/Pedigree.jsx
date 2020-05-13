import React, {Component} from 'react'
import './styles.css'
import Dog from "../../components/dog";
import Tree from 'react-tree-graph' //SVG Tree Structure

//import 'react-tree-graph/dist/style.css' //Default Tree Styling
import './styles.css' //custom styling
import { easeElastic } from 'd3-ease';


export default class Pedigree extends Component {

    //Props = data
    constructor(props){
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
          //content: <Dog {...dog} />,
          children,
        };
    }

   
    render(){
        const data2 = {
            name: 'Parent',
            children: [{
                name: 'Child One'
            }, {
                name: 'Child Two'
            }]
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
                                className: 'custom'
                        }}/>
                </div>

                <div id="info-container">
                    <Dog {...this.props.treeRoot}/>
                </div>            


            </div>

        );
    }
}
