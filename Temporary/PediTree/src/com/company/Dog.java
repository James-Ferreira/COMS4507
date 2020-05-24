package com.company;



public class Dog {
    /* INSTANCE VARIABLES */

    public int year;
    public Dog sire;
    public Dog dam;

    /* Ethereum 'Dog' Structure */
    public int id;
    public String breederName;
    public String name;
    public boolean isBitch;
    public String breed;
    int dob;
    String[] colours;
    int sireID;
    int damID;

    /* CONSTRUCTOR */

    public Dog(int ID, String name, boolean isBitch, String breed, int year, Dog sire, Dog dam) {
        this.id = ID;
        this.name = name;
        this.isBitch = isBitch;
        this.breed = breed;
        this.year = year;
        this.sire = sire;
        this.dam = dam;
    }

    /* METHODS */
    public String toString(){
        StringBuilder result = new StringBuilder();
        if(this.isBitch) result.append("[F]");
        else result.append("[M]");

        result.append(this.name + ": " + this.id);

        if(sire != null) {
            result.append(" S(" + this.sire.name + ")");
        }

        if(dam != null) {
            result.append(" D(" + this.dam.name + ")");
        }

        return result.toString();
    }

}
