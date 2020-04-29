package com.company;



public class Dog implements Comparable<Dog>{
    /* INSTANCE VARIABLES */
    public int id;
    public float COI;
    public int generation;
    public Dog sire;
    public Dog dam;

    /* CONSTRUCTOR */
    public Dog(int id, Dog sire, Dog dam){
        this.id = id;
        this.sire = sire;
        this.dam = dam;
    }

    /* METHODS */

    public int compareTo(Dog d) {
        return this.generation - d.generation;
    }

}
