package com.appnomic.appsone.ui.extension.application.viewobject.alert;

public class ApplicationMetaVO {

	String [] metrics;
	ApplicationVO [] applications;
	String dataActionClass;
	
	public String getDataActionClass() {
		return dataActionClass;
	}
	public void setDataActionClass(String dataActionClass) {
		this.dataActionClass = dataActionClass;
	}
	public String[] getMetrics() {
		return metrics;
	}
	public void setMetrics(String[] metrics) {
		this.metrics = metrics;
	}
	public ApplicationVO[] getApplications() {
		return applications;
	}
	public void setApplications(ApplicationVO[] applications) {
		this.applications = applications;
	}
}

