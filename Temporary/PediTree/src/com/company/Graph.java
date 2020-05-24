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
    public int nextId = 0;

    /* CONSTRUCTOR */
    public Graph(){
        this.yearMap = new HashMap<>();
    }

    /* GRAPH METHODS */
    public void addDog(Dog d) {
        if(yearMap.containsKey(d.year)) {
            this.yearMap.get(d.year).add(d);
        } else{
            List<Dog> list = new ArrayList<>();
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
            boolean isBitch = false;
            if(getRandomInRange(2) == 1) isBitch = true; //50% chance to be male

            Dog prog = new Dog(nextId++, name, isBitch, "labrador", startYear, null,
                    null);
            addDog(prog);
        }

        /* LITTER GENERATION */
        for(int i = 0; i < depth; i++) {
            for(Dog dog : yearMap.get(startYear + i)) {
                //50% chance to have a litter
                if(getRandomInRange(2) == 1) generateLitter(dog, startYear + i);
            }
        }
    }


    public Dog getMate(Dog target, int mateYear) {
        List<Dog> mates = new ArrayList<>();
        mates.addAll(this.getYearSet(mateYear));
        mates.remove(target);

        Dog mate;
        while(mates.size() != 0) {
            mate = mates.get(getRandomInRange(mates.size()));
            if(mate.isBitch != target.isBitch) { return mate; } //correct gender mate found
            mates.remove(mate);
        }


        return null;
    }

    public void generateLitter(Dog target, int mateYear) {
        Dog sire = target;
        Dog dam = getMate(target, mateYear);
        if(dam == null) {
            System.out.printf("No viable mates in year\n");
            return;
        }
        if(target.isBitch) { //reverse if target is female
            sire = dam;
            dam = target;
        }
        int numChildren = getRandomInRange(5);

        /* CREATE CHILDREN */
        for(int i = 0; i < numChildren; i++) {
            String name = names.get(getRandomInRange(names.size()));
            boolean isBitch = false;
            if(getRandomInRange(2) == 1) isBitch = true; //50% chance to be male
            Dog child = new Dog(nextId++, name, isBitch, "labrador",
                    target.year + 1, sire, dam);

            addDog(child);
        }

        //System.out.printf("%s (%d) x %s (%d) = %d children\n", target.name, target.year, mate
        // .name, mate.year, numChildren);
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
