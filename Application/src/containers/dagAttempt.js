import React, { useEffect, useState } from "react";
import * as d3_base from "d3";
import * as d3_dag from "d3-dag";
import { event as d3Event } from "d3-selection";
import { makeStyles, Card } from "@material-ui/core";

const data = {
  id: "Eve",
  children: [
    {
      id: "Cain",
    },
    {
      id: "Seth",
      children: [
        {
          id: "Enos",
        },
        {
          id: "Noam",
        },
      ],
    },
    {
      id: "Abel",
    },
    {
      id: "Awan",
      children: [
        {
          id: "Enoch",
        },
      ],
    },
    {
      id: "Azura",
    },
  ],
};

const width = 600;
const height = 600;
const d3 = Object.assign({}, d3_base, d3_dag);

function draw(dag) {
  const svgSelection = d3.select("#graph"); // Select the SVG element.
  svgSelection.selectAll("*").remove(); // Clear SVG before re-rendering.
  const group = svgSelection.append("g");

  var zoom = d3
    .zoom()
    .on("zoom", (_) => group.attr("transform", d3Event.transform));

  svgSelection.call(zoom);

  const line = d3
    .line()
    .curve(d3.curveCatmullRom)
    .x((d) => d.x)
    .y((d) => d.y);

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
    .attr("stroke", "black");

  // Add text to nodes
  nodes
    .append("text")
    .text((d) => d.id)
    .attr("font-weight", "regular")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "black");
}

const Dag = (props) => {
  const styles = useStyles();
  const [dag, setDag] = useState(null);

  /**
   * Initialise DAG
   */
  useEffect(() => {
    const localDag = d3.dagHierarchy()(data);
    const layout = d3.sugiyama().size([width, height]);
    layout(localDag);
    setDag(localDag);
  }, []);

  if (dag) {
    draw(dag);
  }

  return (
    <Card className={styles.root} elevation={4}>
      <div>
        <svg id="graph" width={width} height={height}></svg>
      </div>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5%",
    padding: 10,
    justifyContent: "stretch",
    alignItems: "center",
  },
}));

export default Dag;
