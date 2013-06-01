package com.appnomic.appsone.ui.extension.application.action;

import com.appnomic.appsone.common.AbstractAction;
import com.appnomic.appsone.common.TimeUtility;
import com.appnomic.appsone.ui.extension.application.viewobject.alert.RealTimeAlertMetaVO;
import com.appnomic.appsone.ui.extension.application.viewobject.alert.RealTimeAlertVO;
import com.appnomic.model.AlertData;
import com.appnomic.service.api.AlertDataDao;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import javax.ejb.EJB;
import javax.naming.Context;
import javax.naming.InitialContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * User: bharadwaj
 * Date: 28/05/13
 * Time: 3:38 PM
 */
@ParentPackage("json-default")
@Namespace("/application")
public class AlertRealTime extends AbstractAction {

    @EJB (mappedName = "java:global/appsone-persistence/appsone-service-api-impl/AlertDataDaoImpl!com.appnomic.service.api.AlertDataDao")
    private AlertDataDao alertDataDao;

    private Map<String, String[]> param;
    private RealTimeAlertMetaVO alertMetaVO;
    private List<RealTimeAlertVO> realTimeAlertVOList;

    public void setAlertDataDao(AlertDataDao alertDataDao){
        this.alertDataDao = alertDataDao;
    }

    public Map<String, String[]> getParam() {
        return param;
    }

    public void setParam(Map<String, String[]> param) {
        this.param = param;
    }

    public RealTimeAlertMetaVO getAlertMetaVO() {
        return alertMetaVO;
    }

    public void setAlertMetaVO(RealTimeAlertMetaVO alertMetaVO) {
        this.alertMetaVO = alertMetaVO;
    }

    public List<RealTimeAlertVO> getRealTimeAlertVOList() {
        return realTimeAlertVOList;
    }

    public void setRealTimeAlertVOList(List<RealTimeAlertVO> realTimeAlertVOList) {
        this.realTimeAlertVOList = realTimeAlertVOList;
    }

    @Action(value="RealTimeAlertMeta", results = {
            @Result(name="success", type="json", params = {
                    "excludeProperties",
                    "session,SUCCESS,ERROR,realTimeAlertVOList",
                    "enableGZIP", "true",
                    "encoding", "UTF-8",
                    "noCache","true",
                    "excludeNullProperties","true"
            })})
    public String applicationAlertMetaAction() {
        param = getParameters();

        alertMetaVO = new RealTimeAlertMetaVO();

        alertMetaVO.setDataActionClass("application/RealTimeAlertMeta.action");

        String [] columns = new String[8];
        columns[0] = "id";
        columns[1] = "message";
        columns[2] = "title";
        columns[3] = "txnId";
        columns[4] = "appId";
        columns[5] = "appName";
        columns[6] = "txnName";
        columns[7] = "createdTime";
        alertMetaVO.setColumns(columns);

        return SUCCESS;
    }

    @Action(value="RealTimeAlertData", results = {
            @Result(name="success", type="json", params = {
                    "excludeProperties",
                    "session,SUCCESS,ERROR,alertMetaVO",
                    "enableGZIP", "true",
                    "encoding", "UTF-8",
                    "noCache","true",
                    "excludeNullProperties","true"
            })})
    public String realTimeAlertDataAction() {
        param = getParameters();

        realTimeAlertVOList = new ArrayList<RealTimeAlertVO>();

        String[] startEndTimes = TimeUtility.get1YearStartEnd();
        System.out.println("Times = ["+startEndTimes[0] + "] [" + startEndTimes[1] + "]");

        if(alertDataDao == null) {
            System.out.println("ejb lookup through injectors failed");
            try {
                Context context = new InitialContext();
                alertDataDao = (AlertDataDao) context.lookup("java:global/appsone-persistence/appsone-service-api-impl/AlertDataDaoImpl!com.appnomic.service.api.AlertDataDao");
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        List<AlertData> allAlerts = alertDataDao.fetchAlerts(startEndTimes[0],startEndTimes[1]);
        if (allAlerts!=null){
            System.out.println("alerts are " +  allAlerts.size());
        }else{
            System.out.println("alerts are null");
        }

        for(AlertData alertData : allAlerts) {
            RealTimeAlertVO realTimeAlertVO = new RealTimeAlertVO();
            realTimeAlertVOList.add(realTimeAlertVO);

            realTimeAlertVO.setAppId(alertData.getAppId());
            realTimeAlertVO.setAppName(alertData.getAppName());
            realTimeAlertVO.setCreatedTime(alertData.getCreatedTime());
            realTimeAlertVO.setId(alertData.getId());
            realTimeAlertVO.setMessage(alertData.getMessage());
            realTimeAlertVO.setTitle(alertData.getTitle());
            realTimeAlertVO.setTxnId(alertData.getTxnId());
            realTimeAlertVO.setTxnName(alertData.getTxnName());
        }

        return SUCCESS;
    }
}
