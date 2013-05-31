package com.appnomic.appsone.ui.extension.application.action;

import com.appnomic.appsone.common.AbstractAction;
import com.appnomic.appsone.common.TimeUtility;
import com.appnomic.appsone.ui.extension.application.viewobject.alert.ApplicationMetaVO;
import com.appnomic.model.AlertData;
import com.appnomic.service.api.AlertDataDao;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import javax.ejb.EJB;
import javax.naming.Context;
import javax.naming.InitialContext;
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
    private ApplicationMetaVO applicationMetaVO;

    public void setAlertDataDao(AlertDataDao alertDataDao){
        this.alertDataDao = alertDataDao;
    }

    public Map<String, String[]> getParam() {
        return param;
    }

    public void setParam(Map<String, String[]> param) {
        this.param = param;
    }

    public ApplicationMetaVO getApplicationVO() {
        return applicationMetaVO;
    }

    public void setApplicationVO(ApplicationMetaVO applicationVO) {
        this.applicationMetaVO = applicationVO;
    }


    @Action(value="EjbApplicationMeta", results = {
            @Result(name="success", type="json", params = {
                    "excludeProperties",
                    "session,SUCCESS,ERROR,alertDataService,componentDataService,applicationDataService,applicationDataVO",
                    "enableGZIP", "true",
                    "encoding", "UTF-8",
                    "noCache","true",
                    "excludeNullProperties","true"
            })})
    public String applicationAlertMetaAction() {
        param = getParameters();

        applicationMetaVO = new ApplicationMetaVO();

        applicationMetaVO.setDataActionClass("application/ApplicationData.action");

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

        return SUCCESS;
    }
}
