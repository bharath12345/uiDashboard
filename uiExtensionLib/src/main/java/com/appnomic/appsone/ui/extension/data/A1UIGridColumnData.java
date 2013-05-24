package com.appnomic.appsone.ui.extension.data;

import java.util.List;
import java.util.Map;

/**
 * User: bharadwaj
 * Date: 12/04/13
 * Time: 12:19 PM
 */
public class A1UIGridColumnData {

    String columnName;
    Object columnData;

    List<A1UIGridSubColumn> a1UIGridSubColumns;

    public List<A1UIGridSubColumn> getA1UIGridSubColumns() {
        return a1UIGridSubColumns;
    }

    public void setA1UIGridSubColumns(List<A1UIGridSubColumn> a1UIGridSubColumns) {
        this.a1UIGridSubColumns = a1UIGridSubColumns;
    }

    public Object getColumnData() {
        return columnData;
    }

    public void setColumnData(Object columnData) {
        this.columnData = columnData;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }
}
