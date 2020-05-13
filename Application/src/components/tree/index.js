/**
 * A CSS based tree renderer. Needs extending to support our needs.
 * DISUSED
 */ 

import React from "react";
import "./styles.css";






const renderNode = (n) => {
  return (
    <li key={n.key}>
      <a href="#">{n.content}</a>
      {n.children && n.children.length != 0 ? (
        <ul>
          {n.children.map((c) => {
            return renderNode(c);
          })}
        </ul>
      ) : null}
    </li>
  );
};
const Tree = (props) => {
  // const data = {
  //   key: "map key"
  //   content: "html...",
  //   children: [
  //     { content: "html...", children: [...] },
  //     { content: "html...", children: [...] },
  //   ],
  // };

  return (
    <div className="tree">
      <ul>{renderNode(props.data)}</ul>
    </div>
  );
};

export default Tree;
