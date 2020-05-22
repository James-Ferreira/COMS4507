import React, { useEffect, useState } from "react";
import * as d3_base from "d3";
import * as d3_dag from "d3-dag";
import { event as d3Event } from "d3-selection"; // the order of this import matters for some reason
import { useTheme, makeStyles, Card } from "@material-ui/core";
import useDimensions from "../hooks/useDimensions";

const d3 = Object.assign({}, d3_base, d3_dag);

const AncestryGraph = (props) => {
  const theme = useTheme();
  const styles = useStyles();
  const [ref, { width, height }] = useDimensions();

  useEffect(() => {
    const data = props.data;
    if (!data || !(width && height)) {
      return;
    }

    // extend javascript array class by a remove function
    // copied from https://stackoverflow.com/a/3955096/12267732
    Array.prototype.remove = function () {
      var what,
        a = arguments,
        L = a.length,
        ax;
      while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };

    // mark unions
    for (var k in data.unions) {
      data.unions[k].isUnion = true;
    }
    // mark persons
    for (var k in data.persons) {
      data.persons[k].isUnion = false;
    }

    // initialize panning, zooming
    var zoom = d3
      .zoom()
      .on("zoom", (_) => g.attr("transform", d3Event.transform));

    // append the svg object to the body of the page
    // assigns width and height
    // activates zoom/pan
    const svg = d3.select("#graph").call(zoom);

    // append group element
    const g = svg.append("g");

    // helper variables
    var i = 0,
      duration = 750,
      x_sep = 140,
      y_sep = 30;

    // declare a dag layout
    var tree = d3
      .sugiyama()
      .nodeSize([y_sep, x_sep])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert())
      .separation((a, b) => {
        return 1;
      });

    // make dag from edge list
    let dag = d3.dagConnect()(data.links);

    // prepare node data
    var all_nodes = dag.descendants();
    all_nodes.forEach((n) => {
      n.data = data.persons[n.id] ? data.persons[n.id] : data.unions[n.id];
      n._children = n.children; // all nodes collapsed by default
      n.children = [];
      n.inserted_nodes = [];
      n.inserted_roots = [];
      n.neighbors = [];
      n.visible = false;
      n.inserted_connections = [];
    });

    // find root node and assign data
    let root = all_nodes.find((n) => n.id == data.start);
    root.visible = true;
    root.neighbors = getNeighbors(root);
    root.x0 = height / 2;
    root.y0 = width / 2;

    // overwrite dag root nodes
    dag.children = [root];

    // draw dag
    update(root);

    // collapse a node
    function collapse(d) {
      // remove root nodes and circle-connections
      var remove_inserted_root_nodes = (n) => {
        // remove all inserted root nodes
        dag.children = dag.children.filter(
          (c) => !n.inserted_roots.includes(c)
        );
        // remove inserted connections
        n.inserted_connections.forEach((arr) => {
          // check existence to prevent double entries
          // which will cause crashes
          if (arr[0].children.includes(arr[1])) {
            arr[0]._children.push(arr[1]);
            arr[0].children.remove(arr[1]);
          }
        });
        // repeat for all inserted nodes
        n.inserted_nodes.forEach(remove_inserted_root_nodes);
      };
      remove_inserted_root_nodes(d);

      // collapse neighbors which are visible and have been inserted by this node
      var vis_inserted_neighbors = d.neighbors.filter(
        (n) => n.visible & d.inserted_nodes.includes(n)
      );
      vis_inserted_neighbors.forEach((n) => {
        // tag invisible
        n.visible = false;
        // if child, delete connection
        if (d.children.includes(n)) {
          d._children.push(n);
          d.children.remove(n);
        }
        // if parent, delete connection
        if (n.children.includes(d)) {
          n._children.push(d);
          n.children.remove(d);
        }
        // if union, collapse the union
        if (n.data.isUnion) {
          collapse(n);
        }
        // remove neighbor handle from clicked node
        d.inserted_nodes.remove(n);
      });
    }

    // uncollapse a node
    function uncollapse(d, make_roots) {
      if (d == undefined) return;

      // neighbor nodes that are already visible (happens when
      // circles occur): make connections, save them to
      // destroy / rebuild on collapse
      var extended_neighbors = d.neighbors.filter((n) => n.visible);
      extended_neighbors.forEach((n) => {
        // if child, make connection
        if (d._children.includes(n)) {
          d.inserted_connections.push([d, n]);
        }
        // if parent, make connection
        if (n._children.includes(d)) {
          d.inserted_connections.push([n, d]);
        }
      });

      // neighbor nodes that are invisible: make visible, make connections,
      // add root nodes, add to inserted_nodes
      var collapsed_neighbors = d.neighbors.filter((n) => !n.visible);
      collapsed_neighbors.forEach((n) => {
        // collect neighbor data
        n.neighbors = getNeighbors(n);
        // tag visible
        n.visible = true;
        // if child, make connection
        if (d._children.includes(n)) {
          d.children.push(n);
          d._children.remove(n);
        }
        // if parent, make connection
        if (n._children.includes(d)) {
          n.children.push(d);
          n._children.remove(d);
          // insert root nodes if flag is set
          if (make_roots & !d.inserted_roots.includes(n)) {
            d.inserted_roots.push(n);
          }
        }
        // if union, uncollapse the union
        if (n.data.isUnion) {
          uncollapse(n, true);
        }
        // save neighbor handle in clicked node
        d.inserted_nodes.push(n);
      });

      // make sure this step is done only once
      if (!make_roots) {
        var add_root_nodes = (n) => {
          // add previously inserted root nodes (partners, parents)
          n.inserted_roots.forEach((p) => dag.children.push(p));
          // add previously inserted connections (circles)
          n.inserted_connections.forEach((arr) => {
            // check existence to prevent double entries
            // which will cause crashes
            if (arr[0]._children.includes(arr[1])) {
              arr[0].children.push(arr[1]);
              arr[0]._children.remove(arr[1]);
            }
          });
          // repeat with all inserted nodes
          n.inserted_nodes.forEach(add_root_nodes);
        };
        add_root_nodes(d);
      }
    }

    function is_extendable(node) {
      return node.neighbors.filter((n) => !n.visible).length > 0;
    }

    function getNeighbors(node) {
      if (node.data.isUnion) {
        return getChildren(node).concat(getPartners(node));
      } else {
        return getOwnUnions(node).concat(getParentUnions(node));
      }
    }

    function getParentUnions(node) {
      if (node == undefined) return [];
      if (node.data.isUnion) return [];
      var u_id = node.data.parent_union;
      if (u_id) {
        var union = all_nodes.find((n) => n.id == u_id);
        return [union].filter((u) => u != undefined);
      } else return [];
    }

    function getParents(node) {
      var parents = [];
      if (node.data.isUnion) {
        node.data.partner.forEach((p_id) =>
          parents.push(all_nodes.find((n) => n.id == p_id))
        );
      } else {
        var parent_unions = getParentUnions(node);
        parent_unions.forEach((u) => (parents = parents.concat(getParents(u))));
      }
      return parents.filter((p) => p != undefined);
    }

    function getOtherPartner(node, union_data) {
      var partner_id = union_data.partner.find(
        (p_id) => (p_id != node.id) & (p_id != undefined)
      );
      return all_nodes.find((n) => n.id == partner_id);
    }

    function getPartners(node) {
      var partners = [];
      // return both partners if node argument is a union
      if (node.data.isUnion) {
        node.data.partner.forEach((p_id) =>
          partners.push(all_nodes.find((n) => n.id == p_id))
        );
      }
      // return other partner of all unions if node argument is a person
      else {
        var own_unions = getOwnUnions(node);
        own_unions.forEach((u) => {
          partners.push(getOtherPartner(node, u.data));
        });
      }
      return partners.filter((p) => p != undefined);
    }

    function getOwnUnions(node) {
      if (node.data.isUnion) return [];
      let unions = [];
      node.data.own_unions.forEach((u_id) =>
        unions.push(all_nodes.find((n) => n.id == u_id))
      );
      return unions.filter((u) => u != undefined);
    }

    function getChildren(node) {
      var children = [];
      if (node.data.isUnion) {
        children = node.children.concat(node._children);
      } else {
        let own_unions = getOwnUnions(node);
        own_unions.forEach((u) => (children = children.concat(getChildren(u))));
      }
      // sort children by birth year, filter undefined
      children = children
        .filter((c) => c != undefined)
        .sort((a, b) =>
          Math.sign((getBirthYear(a) || 0) - (getBirthYear(b) || 0))
        );
      return children;
    }

    function getBirthYear(node) {
      return new Date(node.data.birth_date || NaN).getFullYear();
    }

    function find_path(n) {
      var parents = getParents(n);
      var found = false;
      var result = null;
      parents.forEach((p) => {
        if (p && !found) {
          if (p.id == "profile-89285291") {
            found = true;
            result = [p, n];
          } else {
            result = find_path(p);
            if (result) {
              found = true;
              result.push(n);
            }
          }
        }
      });
      return result;
    }

    function update(source) {
      // Assigns the x and y position for the nodes
      var dag_tree = tree(dag),
        nodes = dag.descendants(),
        links = dag.links();

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = g.selectAll("g.node").data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", click)
        .attr("visible", true);

      // Add Circle for the nodes
      nodeEnter
        .append("circle")
        .attr("class", "node")
        .attr("r", 1e-6)
        .attr("fill", function (d) {
          return is_extendable(d) ? theme.palette.secondary.light : "#fff";
        })
        .attr("stroke-width", 3)
        .attr("stroke", theme.palette.secondary.main);

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
      var nodeUpdate = nodeEnter.merge(node);

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
        .style("fill", function (d) {
          return is_extendable(d) ? theme.palette.secondary.light : "#fff";
        })
        .attr("cursor", "pointer");

      // Remove any exiting nodes
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .attr("visible", false)
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select("circle").attr("r", 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select("text").style("fill-opacity", 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = g.selectAll("path.link").data(links, function (d) {
        return d.source.id + d.target.id;
      });

      // Enter any new links at the parent's previous position.
      var linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate
        .transition()
        .duration(duration)
        .attr("d", (d) => diagonal(d.source, d.target));

      // Remove any exiting links
      var linkExit = link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // expanding a big subgraph moves the entire dag out of the window
      // to prevent this, cancel any transformations in y-direction
      svg
        .transition()
        .duration(duration)
        .call(
          zoom.transform,
          d3
            .zoomTransform(g.node())
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

      // Toggle unions, children, partners on click.
      function click(d) {
        // do nothing if node is union
        if (d.data.isUnion) return;

        // uncollapse if there are uncollapsed unions / children / partners
        if (is_extendable(d)) uncollapse(d);
        // collapse if fully uncollapsed
        else collapse(d);

        update(d);
      }
    }
  }, [props.data, width, height]);

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
    height: 800,
  },
  container: {
    width: "100%",
    height: "100%",
  },
}));

export default AncestryGraph;
