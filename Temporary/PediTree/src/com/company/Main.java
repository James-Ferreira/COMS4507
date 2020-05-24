package com.company;

import sun.security.provider.certpath.Vertex;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;


public class Main {


    public static void main(String[] args) {

        Graph g = new Graph();
        g.generatePedigree(20, 1990, 5);

        for(Integer year : g.yearMap.keySet()) {
            System.out.printf("-- %d --\n", year);
            List<Dog> list = g.yearMap.get(year);

            for(Dog dog : list) {
                System.out.println(dog.toString());
            }
        }
    }

}


