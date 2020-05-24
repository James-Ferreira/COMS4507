package com.company;


import sun.security.provider.certpath.Vertex;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

public class Graph {
    /* INSTANCE VARIABLES */
    public Map<Integer, List<Dog>> yearMap; //Maps year to a set of all dogs in this birth year
    public List<String> names = readNames();

    /* CONSTRUCTOR */
    public Graph(){
        this.yearMap = new HashMap<>();
    }

    /* GRAPH METHODS */
    public void addDog(Dog d) {
        if(yearMap.containsKey(d.year)) {
            this.yearMap.get(d.year).add(d);
        } else{
            List<Dog> list = new ArrayList<Dog>();
            list.add(d);
            this.yearMap.put(d.year, list);
        }
    }

    public List<Dog> getYearSet(int year) {
        return this.yearMap.get(year);
    }



    /* PEDIGREE METHODS */

    public void generatePedigree(int progenitors, int startYear, int depth) {

        /* CREATE PROGENITORS */
        for(int i = 0; i < progenitors; i++) {
            String name = names.get(getRandomInRange(names.size()));
            Dog prog = new Dog(name, startYear, null, null);
            addDog(prog);
        }

        for(int i = 0; i < depth; i++) {
            for(Dog dog : yearMap.get(startYear + i)) {
                generateLitter(dog, startYear);
            }
        }


    }


    public Dog getMate(Dog target, int mateYear) {
        List<Dog> mates = this.getYearSet(mateYear);
        if(mates.size() == 1 ) {
            System.out.printf("No viable mates in year");
            return null;
        }

        /* Prevent asexual reproduction */
        Dog mate;
        do {
            mate = mates.get(getRandomInRange(mates.size()));
        } while(mate.equals(target));

        return mate;
    }

    public void generateLitter(Dog target, int mateYear) {
        Dog mate = getMate(target, mateYear);
        int numChildren = getRandomInRange(5);

        /* CREATE CHILDREN */
        for(int i = 0; i < numChildren; i++) {
            String name = names.get(getRandomInRange(names.size()));
            Dog child = new Dog(name, target.year + 1, target, mate);
            addDog(child);
        }

        System.out.printf("%s (%d) x %s (%d) = %d children\n", target.name, target.year,
                mate.name, mate.year, numChildren);
    }


    /* HELPER METHODS */

    /*
       Random int between [0, max)
    */
    public int getRandomInRange(int max){
        Random random = new Random();
        int val = random.nextInt(max);
        return val;
    }


    public List<String> readNames(){
        try {
            BufferedReader reader = new BufferedReader(new FileReader("names.txt"));
            List<String> names = new ArrayList<>();
            String line;

            while ((line = reader.readLine()) != null) {
                names.add(line);
            }
            return names;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
