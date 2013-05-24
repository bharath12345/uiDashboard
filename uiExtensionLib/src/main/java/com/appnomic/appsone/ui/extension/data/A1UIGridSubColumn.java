package com.appnomic.appsone.ui.extension.data;

/**
 * User: bharadwaj
 * Date: 12/04/13
 * Time: 12:23 PM
 */
public class A1UIGridSubColumn {

    String subColumnName;
    Object subColumnData;

    public Object getSubColumnData() {
        return subColumnData;
    }

    public void setSubColumnData(Object subColumnData) {
        this.subColumnData = subColumnData;
    }

    public String getSubColumnName() {
        return subColumnName;
    }

    public void setSubColumnName(String subColumnName) {
        this.subColumnName = subColumnName;
    }
}
