package com.appnomic.appsone.ui.extension.application.action;

import java.util.*;

import com.appnomic.appsone.common.AbstractAction;
import com.appnomic.appsone.common.ActionConstants;
import com.appnomic.appsone.common.TimeUtility;
import com.appnomic.appsone.config.entity.ApplicationAlertsGridEntity;
import com.appnomic.appsone.config.entity.UserConfigEntity;
import com.appnomic.appsone.config.persistence.Persistence;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Action;

import com.appnomic.appsone.ui.extension.application.viewobject.alert.*;

import com.appnomic.domainobject.AlertCountSummary;
import com.appnomic.domainobject.AlertCountSummary.SUMMARY_CATEGORY;
import com.appnomic.domainobject.AlertSeverity;
import com.appnomic.domainobject.ApplicationData;
import com.appnomic.exception.InvalidTimeIntervalException;
import com.appnomic.service.ApplicationDataService;
import com.appnomic.service.ComponentDataService;
import com.appnomic.service.AlertDataService;

@ParentPackage("json-default")
@Namespace("/application")
public class AlertInfoNocAction extends AbstractAction {
	
	private Map<String, String[]> param;
	
	private AlertDataService alertDataService;
	private ComponentDataService componentDataService;
	private ApplicationDataService applicationDataService;
	
	private ApplicationMetaVO applicationMetaVO;
	private ApplicationDataVO applicationDataVO;

    private static Map<String, Map<String, Map<String, Integer>>> appAlerts;
    private static Map<String, FetchDataTask> taskMap;
    private static Map<String, Map<String, Map<String, Integer>>> changedMetricsMap;

    private Random rand;
	private static final int min = 0, max = 100;
	
	public ComponentDataService getComponentDataService() {
		return componentDataService;
	}

	public void setComponentDataService(ComponentDataService componentDataService) {
		this.componentDataService = componentDataService;
	}

	public ApplicationDataService getApplicationDataService() {
		return applicationDataService;
	}

	public void setApplicationDataService(
			ApplicationDataService applicationDataService) {
		this.applicationDataService = applicationDataService;
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
	
	public ApplicationDataVO getApplicationDataVO() {
		return applicationDataVO;
	}

	public void setApplicationDataVO(ApplicationDataVO applicationDataVO) {
		this.applicationDataVO = applicationDataVO;
	}

	public AlertInfoNocAction() {
	}
	
	public String nocAction() {		
		return SUCCESS;
	}

	public AlertDataService getAlertDataService() {
		return alertDataService;
	}

	public void setAlertDataService(AlertDataService alertDataService) {
		this.alertDataService = alertDataService;
	}

    @Action(value="ApplicationMeta", results = {
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
		
		String [] metrics = new String[5];
		metrics[0] = SUMMARY_CATEGORY.COMPONENT_AVAILABILITY.name();
		metrics[1] = SUMMARY_CATEGORY.COMPONENT_STATIC.name();
		metrics[2] = SUMMARY_CATEGORY.TRANSACTION_ONLINE_ANALYTIC.name();
		metrics[3] = SUMMARY_CATEGORY.TRANSACTION_BATCH_ANALYTIC.name();
		metrics[4] = SUMMARY_CATEGORY.COMPONENT_ANALYTIC.name();
		applicationMetaVO.setMetrics(metrics);
		
		/*Persistence persistence = new Persistence();
        String json = persistence.get(userUuid);
        UserConfigEntity uce = gson.fromJson(json, UserConfigEntity.class);
        String tabListObjectUuid = uce.getUuidMap().get(ActionConstants.NOC.APPLICATION_ALERTS.name());
        json = persistence.get(tabListObjectUuid);
        */

        int delay = 1000; // delay for 1 sec.
        int period = 2000; // repeat every 2 secs.

        // ToDo: this is temporary - remove it once the config persistence is up
        String [] appsInterestedIn = ApplicationAlertsGridEntity.getDefaultConfig().getApplications();
		if(appsInterestedIn == null || appsInterestedIn.length == 0 ) {
			applicationMetaVO = null;
			return SUCCESS;
		}

        appAlerts = new HashMap<String, Map<String, Map<String, Integer>>>();
		
		List<ApplicationData> allApplications = applicationDataService.getAll();
		List<ApplicationVO> applicationList = new ArrayList<ApplicationVO>();
		for(ApplicationData application : allApplications) {
			boolean appfound = false;
			for(String intApp: appsInterestedIn) {
				if(application.getName().equalsIgnoreCase(intApp)) {
					appfound = true;
					break;
				}
			}
			if(appfound == false) {
				// user has not saved this application as one he is interested in
				continue;
			}
			ApplicationVO applicationVO = new ApplicationVO();
			applicationVO.setId(application.getId());
			applicationVO.setName(application.getName());
			applicationList.add(applicationVO);

            Map<String, Map<String, Integer>> severityMap = new HashMap<String, Map<String, Integer>>();
            appAlerts.put(application.getName(), severityMap);

            severityMap.put(SUMMARY_CATEGORY.COMPONENT_ANALYTIC.name(), getInnerMap());
            severityMap.put(SUMMARY_CATEGORY.COMPONENT_AVAILABILITY.name(), getInnerMap());
            severityMap.put(SUMMARY_CATEGORY.COMPONENT_STATIC.name(), getInnerMap());
            severityMap.put(SUMMARY_CATEGORY.TRANSACTION_BATCH_ANALYTIC.name(), getInnerMap());
            severityMap.put(SUMMARY_CATEGORY.TRANSACTION_ONLINE_ANALYTIC.name(), getInnerMap());

            Timer timer = new Timer();
            if(taskMap.get(application.getName()) == null) {
                System.out.println("scheduling alert fetch task for app = " + application.getName());
                FetchDataTask fetchDataTask = new FetchDataTask(application.getId(), application.getName());
                timer.scheduleAtFixedRate(fetchDataTask, delay, period);
            }

		}
		applicationMetaVO.setApplications(applicationList.toArray(new ApplicationVO[applicationList.size()]));

        return SUCCESS;
	}

    private Map getInnerMap() {
        Map<String, Integer> alertCategoryMap = new HashMap<String, Integer>();
        alertCategoryMap.put(AlertSeverity.HIGH.name(), 0);
        alertCategoryMap.put(AlertSeverity.LOW.name(), 0);
        alertCategoryMap.put(AlertSeverity.MEDIUM.name(), 0);
        alertCategoryMap.put(AlertSeverity.UNKNOWN.name(), 0);
        return alertCategoryMap;
    }
	
	private void setDummyApplicationData(String applicationName, ApplicationDataVO applicationDataVO) {
		MetricData [] metricDataset = new MetricData[5];
		applicationDataVO.setMetrics(metricDataset);
		applicationDataVO.setApplicationName(applicationName);
	
		metricDataset[0] = getDummyMetricData(SUMMARY_CATEGORY.COMPONENT_ANALYTIC);
		metricDataset[1] = getDummyMetricData(SUMMARY_CATEGORY.COMPONENT_AVAILABILITY);
		metricDataset[2] = getDummyMetricData(SUMMARY_CATEGORY.COMPONENT_STATIC);
		metricDataset[3] = getDummyMetricData(SUMMARY_CATEGORY.TRANSACTION_BATCH_ANALYTIC);
		metricDataset[4] = getDummyMetricData(SUMMARY_CATEGORY.TRANSACTION_ONLINE_ANALYTIC);
	}
	
	private MetricData getDummyMetricData(SUMMARY_CATEGORY category) {
		MetricData metricDataset = new MetricData();
		int [] counts = new int[4];
		rand = new Random();
		counts[0] = rand.nextInt(max - min + 1) + min;
		counts[1] = rand.nextInt(max - min + 1) + min;
		counts[2] = rand.nextInt(max - min + 1) + min;
        counts[3] = rand.nextInt(max - min + 1) + min;
		metricDataset.setCount(counts);
		metricDataset.setName(category.name());
		return metricDataset;
	}
	
	@Action(value="ApplicationData", results = {
	        @Result(name="success", type="json", params = {
	        		"excludeProperties",
	                "session,SUCCESS,ERROR,alertDataService,componentDataService,applicationDataService,applicationMetaVO",
	                "enableGZIP", "true",
	        		"encoding", "UTF-8",
	                "noCache","true",
	                "excludeNullProperties","true"
	            })})
	public String applicationAlertAction() {
		param = getParameters();
		
		String keyVal = "Application Alert: ";
		for(String key : parameters.keySet()) {
			keyVal += "[ " + key + " = ";
			for(String value : parameters.get(key)) {
				keyVal += value + ", ";
			}
			keyVal += "] ";
		}
		System.out.println("key value map = " + keyVal);
		
		String applicationName = (parameters.get("name")[0]);
		int id = Integer.parseInt(parameters.get("id")[0]);

        Map<String, Map<String, Integer>> metrics = changedMetricsMap.get(applicationName);
        if(metrics == null) {
            return SUCCESS;
        }

        changedMetricsMap.remove(applicationName);
        applicationDataVO = new ApplicationDataVO();

        MetricData [] metricDataset = new MetricData[5];
        applicationDataVO.setMetrics(metricDataset);
        applicationDataVO.setApplicationName(applicationName);
        applicationDataVO.setApplicaitonId(id);

        metricDataset[0] = getMetricData(metrics, SUMMARY_CATEGORY.COMPONENT_ANALYTIC);
        metricDataset[1] = getMetricData(metrics, SUMMARY_CATEGORY.COMPONENT_AVAILABILITY);
        metricDataset[2] = getMetricData(metrics, SUMMARY_CATEGORY.COMPONENT_STATIC);
        metricDataset[3] = getMetricData(metrics, SUMMARY_CATEGORY.TRANSACTION_BATCH_ANALYTIC);
        metricDataset[4] = getMetricData(metrics, SUMMARY_CATEGORY.TRANSACTION_ONLINE_ANALYTIC);
		
		return SUCCESS;
	}

    private boolean changeUpdate(AlertCountSummary acs, SUMMARY_CATEGORY category, String appName,
                                 Map<String, Map<String, Integer>> appMap, Map<String, Integer> categoryMap, AlertSeverity alertSeverity) {
        int count = acs.getCount(category, alertSeverity);
        if(categoryMap.get(alertSeverity.name()) != count) {
            categoryMap.put(alertSeverity.name(), count);
            changedMetricsMap.put(appName, appMap);
            System.out.println("change in alert count for app = " + appName + " category = " + category.name() + " severity = " + alertSeverity.name());
            return true;
        }
        return false;
    }

    private MetricData getMetricData(Map<String, Map<String, Integer>> categoryMap, SUMMARY_CATEGORY category) {
        MetricData metricDataset = new MetricData();

        int [] counts = new int[4];
        counts[0] = categoryMap.get(category.name()).get(AlertSeverity.HIGH);
        counts[1] = categoryMap.get(category.name()).get(AlertSeverity.MEDIUM);
        counts[2] = categoryMap.get(category.name()).get(AlertSeverity.LOW);
        counts[3] = categoryMap.get(category.name()).get(AlertSeverity.UNKNOWN);

        metricDataset.setCount(counts);
        metricDataset.setName(category.name());
        return metricDataset;
    }

    private MetricData getMetricData(AlertCountSummary acs, SUMMARY_CATEGORY category, String appName) {
		MetricData metricDataset = new MetricData();
		int [] counts = new int[4];
		if(acs != null) {
            Map<String, Map<String, Integer>> appMap = appAlerts.get(appName);
            Map<String, Integer> categoryMap = appMap.get(category.name());
            changeUpdate(acs, category, appName, appMap, categoryMap, AlertSeverity.HIGH);
            changeUpdate(acs, category, appName, appMap, categoryMap, AlertSeverity.MEDIUM);
            changeUpdate(acs, category, appName, appMap, categoryMap, AlertSeverity.LOW);
            changeUpdate(acs, category, appName, appMap, categoryMap, AlertSeverity.UNKNOWN);
		} else {
			counts[0] = -1;
			counts[1] = -1;
			counts[2] = -1;
            counts[3] = -1;
		}
		metricDataset.setCount(counts);
		metricDataset.setName(category.name());
		return metricDataset;
	}

    class FetchDataTask extends TimerTask {

        int id;
        String name;

        public FetchDataTask(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public void run() {
            System.out.println("application being assembled = " + name + "id = " + id);

            //String[] startEndTimes = TimeUtility.get5MinStartEnd();
            String[] startEndTimes = TimeUtility.get30MinStartEnd();
            System.out.println("Times = ["+startEndTimes[0] + "] [" + startEndTimes[1] + "]");

            MetricData [] metricDataset = new MetricData[5];

            AlertCountSummary acs = null;
            try {
                acs = alertDataService.getCountSummary(id, startEndTimes[0], startEndTimes[1]);
            } catch (InvalidTimeIntervalException e) {
                e.printStackTrace();
            }
            metricDataset[0] = getMetricData(acs, SUMMARY_CATEGORY.COMPONENT_ANALYTIC, name);
            metricDataset[1] = getMetricData(acs, SUMMARY_CATEGORY.COMPONENT_AVAILABILITY, name);
            metricDataset[2] = getMetricData(acs, SUMMARY_CATEGORY.COMPONENT_STATIC, name);
            metricDataset[3] = getMetricData(acs, SUMMARY_CATEGORY.TRANSACTION_BATCH_ANALYTIC, name);
            metricDataset[4] = getMetricData(acs, SUMMARY_CATEGORY.TRANSACTION_ONLINE_ANALYTIC, name);

            if(acs == null) {
                System.out.println("Actual alerts were NOT found. Displaying dummy data");
                //setDummyApplicationData(applicationName, applicationDataVO);
            }
        }

    }
}
