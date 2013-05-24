package com.appnomic.appsone.ui.extension.data;

import java.util.List;

/**
 * User: debasis.d
 * Date: 13/4/13
 * Time: 11:31 PM
 */
public class A1UIGridRowData {

    private Long rowId;

    private List<A1UIGridColumnData> columnDataList;

    public List<A1UIGridColumnData> getColumnDataList() {
        return columnDataList;
    }

    public void setColumnDataList(List<A1UIGridColumnData> columnDataList) {
        this.columnDataList = columnDataList;
    }

    public Long getRowId() {
        return rowId;
    }

    public void setRowId(Long rowId) {
        this.rowId = rowId;
    }
}
