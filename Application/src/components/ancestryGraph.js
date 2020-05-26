/**
 * A card for displaying the ancestry graph.
 *
 * A significant portion of this code was sourced from
 * Benjamin Portner's js_family_tree git repository found at
 * https://github.com/BenPortner/js_family_tree/
 */

import React, { useEffect, useState } from "react";
import * as d3_base from "d3";
import * as d3_dag from "d3-dag";
import { event as d3Event } from "d3-selection"; // the order of this import matters for some reason
import { useTheme, makeStyles, Card, Typography } from "@material-ui/core";
import useDimensions from "../hooks/useDimensions";
import { useHistory } from "react-router-dom";
import { hasGeneticCondition } from "../util/genealogy";
import { FaDisease } from "react-icons";

const d3 = Object.assign({}, d3_base, d3_dag);

// helper variables
let i = 0,
  duration = 750,
  x_sep = 70,
  y_sep = 30;

// declare a dag layout
let tree = d3
  .sugiyama()
  .nodeSize([y_sep, x_sep])
  .layering(d3.layeringSimplex())
  .decross(d3.decrossOpt)
  .coord(d3.coordVert())
  .separation((a, b) => {
    return 1;
  });

const AncestryGraph = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const styles = useStyles();
  const [ref, { width, height }] = useDimensions();
  const [dag, setDag] = useState(null);
  const [{ svg, group, zoom }, setSvgElements] = useState({
    svg: null,
    group: null,
    zoom: null,
  });

  const data = props.data;
  useEffect(() => {
    console.log("Initialising graph...");
    if (!(data && data.links.length > 0) || !(width && height)) {
      return;
    }

    // mark unions
    for (let k in data.unions) {
      data.unions[k].isUnion = true;
    }
    // mark persons
    for (let k in data.persons) {
      data.persons[k].isUnion = false;
    }

    // Initialise zooming and panning
    const z = d3
      .zoom()
      .on("zoom", (_) => g.attr("transform", d3Event.transform));
    // Find SVG element and enable pan/zoom
    const s = d3.select("#graph").call(z);
    // append group element
    const g = s.append("g").attr("id", "mainGroup");
    setSvgElements({ svg: s, group: g, zoom: z });

    // make dag from edge list
    let dag = d3.dagConnect()(data.links);
    setDag(dag);
    console.log("Initialised graph...");
  }, [width, height]);

  useEffect(() => {
    if (!(dag && svg && group && zoom)) {
      return;
    }

    let descendants = dag.descendants();
    descendants.forEach((n) => {
      n.data = data.persons[n.id] ? data.persons[n.id] : data.unions[n.id];
    });

    let root = descendants.find((n) => n.id == data.start);
    root.x0 = height / 2;
    root.y0 = width / 2;
    update(root);
  }, [dag, svg, group, zoom]);

  const update = (source) => {
    // Assigns the x and y position for the nodes
    tree(dag);
    let nodes = dag.descendants(),
      links = dag.links();

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = group.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", nodeClicked);

    // Add Circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", "node")
      .attr("r", 1e-6)
      .attr("fill", getNodeFill)
      .attr("stroke-width", 3)
      .attr("stroke", getNodeStroke);

    // Add genetic condition markers
    nodeEnter
      .append("text")
      .attr("dy", "4")
      .attr("x", -2)
      .style("font", "12px sans-serif")
      .text(getNodeText)
      .attr("cursor", "pointer");

    // Add names as node labels
    nodeEnter
      .append("text")
      .attr("dy", "-2")
      .attr("x", 13)
      .attr("text-anchor", "start")
      .style("font", "12px sans-serif")
      .text((d) => d.data.name);
    // add microchip number as a label
    nodeEnter
      .append("text")
      .attr("dy", "10")
      .attr("x", 13)
      .attr("text-anchor", "start")
      .style("font", "12px sans-serif")
      .text((d) => d.data.microchipNumber);

    // UPDATE
    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate
      .select("circle.node")
      .attr("r", (d) => 10 * !d.data.isUnion + 0 * d.data.isUnion)
      .style("fill", getNodeFill)
      .attr("cursor", "pointer");

    // ****************** links section ***************************

    // Update the links...
    let link = group.selectAll("path.link").data(links, function (d) {
      return d.source.id + d.target.id;
    });

    // Enter any new links at the parent's previous position.
    let linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("d", function (d) {
        let o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    // UPDATE
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr("d", (d) => diagonal(d.source, d.target));

    // expanding a big subgraph moves the entire dag out of the window
    // to prevent this, cancel any transformations in y-direction
    svg
      .transition()
      .duration(duration)
      .call(
        zoom.transform,
        d3
          .zoomTransform(group.node())
          .translate(-(source.y - source.y0), -(source.x - source.x0))
      );

    // Store the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;

      return path;
    }
  };

  const getNodeFill = (node) => {
    return "#fff";
  };

  const getNodeStroke = (node) => {
    if (!node.data.isUnion && hasGeneticCondition(node.data)) {
      return theme.palette.error.light
    }
    return theme.palette.secondary.main;
  };

  const getNodeText = (node) => {
    if (!node.data.isUnion && hasGeneticCondition(node.data)) {
      return "!";
    }
  };

  const nodeClicked = (node) => {
    history.push(`/dogs/${node.data.microchipNumber}`);
    centerNode(node);
  };

  const centerNode = (source) => {
    const t = d3.zoomTransform(group.node());
    let x = -source.y0;
    let y = -source.x0;
    x = x * t.k + width / 2;
    y = y * t.k + height / 2;
    svg
      .transition()
      .duration(duration)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(t.k));
  };

  return (
    <Card className={styles.root}>
      <div className={styles.container} ref={ref}>
        {data.links.length > 0 ? (
          <svg id="graph" width={width} height={height}></svg>
        ) : (
          <Typography variant="h6">
            {data.persons[data.start].name} does not have any relationships to
            display.
          </Typography>
        )}
        <div className={styles.legend}>
          <Typography variant="body2">! = Genetic Condition</Typography>
        </div>
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
    height: 800,
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  legend: {
    position: "absolute",
    top: 10,
    left: 10
  }
}));

export default AncestryGraph;
