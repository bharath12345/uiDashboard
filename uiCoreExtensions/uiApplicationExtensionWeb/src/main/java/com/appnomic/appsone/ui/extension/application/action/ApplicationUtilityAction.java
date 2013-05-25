package com.appnomic.appsone.ui.extension.application.action;

import java.util.Map;

import com.appnomic.appsone.config.entity.LinksListEntity;
import com.appnomic.appsone.common.AbstractAction;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

@ParentPackage("json-default")
@Namespace("/application")
public class ApplicationUtilityAction extends AbstractAction {

	private LinksListEntity.LinkEntity[] linkEntityList;
	private Map<String, String[]> param;
	
	public LinksListEntity.LinkEntity[] getLinkEntityList() {
		return linkEntityList;
	}

	public void setLinkEntityList(LinksListEntity.LinkEntity[] linkEntityList) {
		this.linkEntityList = linkEntityList;
	}

	public Map<String, String[]> getParam() {
		return param;
	}

	public void setParam(Map<String, String[]> param) {
		this.param = param;
	}

	@Action(value="links", results = {
	        @Result(name="success", type="json", params = {
	        		"excludeProperties",
	                "parameters,session,SUCCESS,ERROR,agcVO,levelDbMap",
	        		"enableGZIP", "true",
	        		"encoding", "UTF-8",
	                "noCache","true",
	                "excludeNullProperties","true"
	            })})
	public String pagesAction() {
		param = getParameters();

        /*LinksListEntity nocPLE = UtilityAction.getPageListEntity(userUuid);
        linkEntityList = nocPLE.getLinkEntity();*/

        // ToDo: The below code is temporary - remove it once the persistence stuff starts working
        linkEntityList = LinksListEntity.getDefaultApplicationPageEntity().getLinkEntity();


        return SUCCESS;
	}
	
}
