package com.appnomic.appsone.ui.extension.data;

import java.util.List;

/**
 * User: bharadwaj
 * Date: 09/04/13
 * Time: 3:48 PM
 */
public class A1UIGridFormData {

    /*
        - In the HashMap, the key is the attribute name and value could be of type long, string, double
        or an array of those types
        - The HashMap holds one row. The array of HashMap holds the whole table
     */

    List<A1UIGridRowData> gridRows;


    public List<A1UIGridRowData> getGridRows() {
        return gridRows;
    }

    public void setGridRows(List<A1UIGridRowData> gridRows) {
        this.gridRows = gridRows;
    }




}
