/**
 * This component uses a DAG to render the ancestry tree for the selected dog.
 */

import React, { useEffect, useState } from "react";
import * as d3_base from "d3";
import * as d3_dag from "d3-dag";
import { event as d3Event } from "d3-selection";
import { makeStyles, Card } from "@material-ui/core";
import useDimensions from "../hooks/useDimensions";
import { useHistory } from "react-router-dom";

const d3 = Object.assign({}, d3_base, d3_dag);

const AncestryGraph = (props) => {
  const styles = useStyles();
  const history = useHistory();
  const [ref, { x, y, width, height }] = useDimensions();
  const [dag, setDag] = useState(null);
  const [margins, setMargins] = useState({});

  /**
   * Initialise DAG
   */
  useEffect(() => {
    /* Return early if the dimensions haven't been set yet */
    if (!(width && height)) return;
    const localMargins = { horizontal: width / 8, vertical: height / 8 };
    const localDag = d3.dagHierarchy()(props.data);

    /* Create the layout object to compute render shape */
    const layout = d3
      .sugiyama()
      .size([
        width - localMargins.horizontal * 2,
        height - localMargins.vertical * 2,
      ])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert())
      .separation((a, b) => {
        return 1;
      });
    layout(localDag);
    setDag(localDag);
    setMargins(localMargins);
  }, [props.data, width, height]);

  const nodeClicked = (d) => {
    history.push(`/dogs/${d.id}`);
  };

  /**
   * Draw the DAG to the svg element.
   * @param {*} dag
   */
  const draw = (dag) => {
    const svgSelection = d3.select("#graph"); // Select the SVG element.
    svgSelection.selectAll("*").remove(); // Clear SVG before re-rendering.

    // Create the initial grouping and centre it
    const group = svgSelection
      .append("g")
      .attr(
        "transform",
        `translate(${margins.horizontal},${margins.vertical})`
      );

    // Create a d3 zoom object to allow zooming and panning
    var zoom = d3
      .zoom()
      .on("zoom", () => group.attr("transform", d3Event.transform));

    // Instantiate zoom on the svg and set start coordinates
    svgSelection
      .call(zoom)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(margins.horizontal, margins.vertical)
      );

    const line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => d.x)
      .y((d) => d.y);

    // Add connecting paths
    group
      .append("g")
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", ({ data }) => line(data.points))
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke", "black");

    // Select nodes
    const nodes = group
      .append("g")
      .selectAll("g")
      .data(dag.descendants())
      .enter()
      .append("g")
      .attr("transform", ({ x, y }) => `translate(${x}, ${y})`);

    // Plot node circles
    nodes
      .append("circle")
      .attr("r", 20)
      .attr("fill", "white")
      .attr("stroke", "black")
      .on("click", nodeClicked);

    // Add text to nodes
    nodes
      .append("text")
      .text((d) => d.id)
      .attr("font-weight", "regular")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .on("click", nodeClicked);
  };

  if (dag && margins) {
    draw(dag);
  }

  return (
    <Card className={styles.root}>
      <div className={styles.container} ref={ref}>
        <svg id="graph" width={width} height={height}></svg>
      </div>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 2,
    padding: 5,
    justifyContent: "stretch",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
  },
}));

export default AncestryGraph;
