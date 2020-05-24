package com.company;



public class Dog {
    /* INSTANCE VARIABLES */
    public String name;
    public int year;
    public Dog sire;
    public Dog dam;

    /* CONSTRUCTOR */
    public Dog(String name, int year, Dog sire, Dog dam){
        this.name = name;
        this.year = year;
        this.sire = sire;
        this.dam = dam;
    }

    /* METHODS */
    public String toString(){
        StringBuilder result = new StringBuilder();
        result.append(this.name + ": " + this.year );

        if(sire != null) {
            result.append(" ( " + this.sire.name + " )");
        }

        if(dam != null) {
            result.append(" ( " + this.dam.name + " )");
        }

        return result.toString();
    }

}
