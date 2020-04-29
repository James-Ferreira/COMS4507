package com.company;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;


public class Main {


    public static void main(String[] args) {

        /*
        //[OUTBRED]
        Dog dad = new Dog(2, null, null );
        Dog mum = new Dog(1, null, null);
        Dog root = new Dog(0, dad, mum );
        Set<Dog> test = new HashSet<>();
        TreeNode<Dog> pedigree = pedigreeTraverse(root);
        System.out.printf("OB_DOG || COI = %f, GENS =%d, #A:%d\n", root.COI,
                root.generation, pedigree.subtreeSet.size());


        //[FULL SIBLING INBRED: Expected COI = 25%]
        // LEVEL 3 ANCESTORS
            Dog I = new Dog(8, null, null );
            Dog H = new Dog(7, null, null);
            Dog G = new Dog(6, null, null );
            Dog F = new Dog(5, null, null);
        // LEVEL 2 ANCESTORS
            Dog E = new Dog(4, H, I );
            Dog D = new Dog(3, F, G);
        // LEVEL 1 ANCESTORS
            Dog C = new Dog(2, D, E );
            Dog B = new Dog(1, D, E);

        Dog A = new Dog(0, B, C );

        TreeNode<Dog> fs_pedigree = pedigreeTraverse(A);
        System.out.printf("FS_DOG || COI = %f, GENS =%d, #A:%d\n", A.COI,
                A.generation, fs_pedigree.subtreeSet.size());


         */

        //[FULL SIBLING INBRED: Expected COI = 12.5%]

        // LEVEL 2 ANCESTORS
        Dog F = new Dog(5, null, null );
        Dog E = new Dog(4, null, null );
        Dog D = new Dog(3, null, null );
        // LEVEL 1 ANCESTORS
        Dog C = new Dog(2, F, E );
        Dog B = new Dog(1, D, E);

        Dog A = new Dog(0, B, C );

        TreeNode<Dog> hs_pedigree = pedigreeTraverse(A);
        System.out.printf("HS_DOG || COI = %f, GENS =%d, #A:%d\n", A.COI,
                A.generation, hs_pedigree.subtreeSet.size());
    }

    /*
        RECURSIVE PEDIGREE TRAVERSAL AND COI CALC
     */
    public static TreeNode<Dog> pedigreeTraverse(Dog d) {
        TreeNode<Dog> pedigree = new TreeNode<>(d);

        /* BASE CASES */
        if (d.sire == null && d.dam == null) { //furthest back this branch goes
            d.generation = 1;
            return pedigree;
        }

        /* DIVIDE & CONQUER */
        TreeNode<Dog> sireTree = pedigreeTraverse(d.sire);
        TreeNode<Dog> damTree = pedigreeTraverse(d.dam);

        pedigree.addNode(sireTree);
        pedigree.addNode(damTree);

        d.generation = Math.max(d.sire.generation, d.dam.generation) + 1;

        /* COMBINE */
        Set<Dog> intersection = new HashSet<>(sireTree.subtreeSet);

        intersection.retainAll(damTree.subtreeSet);
        if (intersection.size() > 0) {
            //if sire_tree ∩ dam_tree, ∃ inbreeding. Calculate Coefficient of Inbreeding (COI)

            for (Dog ancestor : intersection) {
                float F_a = ancestor.COI;
                int n_1 =  d.sire.generation - ancestor.generation; //distance from sire to CA
                int n_2 = d.dam.generation - ancestor.generation ; //distance from dam to CA
                d.COI += Math.pow(0.5, n_1 + n_2 + 1.0) * (1.0 + F_a);
            }
        } else { d.COI = 0; }

        return pedigree;
    }
}


