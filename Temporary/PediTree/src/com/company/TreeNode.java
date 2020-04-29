package com.company;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class TreeNode<T> {

    public T data;
    public TreeNode<T> parent; //in tree terms, not family tree terms
    public List<TreeNode<T>> children; //i.e. children would be a dogs parents
    public Set<T> subtreeSet; //set to store Dogs in this nodes ancestry

    public TreeNode(T data){
        this.data = data;
        this.children = new LinkedList<TreeNode<T>>();
        this.subtreeSet = new HashSet<T>();
    }

    public void addNode(TreeNode<T> node) {
        this.children.add(node);
        this.subtreeSet.add(node.data);
        this.subtreeSet.addAll(node.subtreeSet);
    }

}
