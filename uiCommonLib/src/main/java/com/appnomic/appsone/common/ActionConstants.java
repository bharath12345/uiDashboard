package com.appnomic.appsone.common;

public interface ActionConstants {

	public enum ACCTYPE {
		DIRECTORY,
		CONFIGURATION,
		GRID,
		TOPOLOGY,
		GRAPH
	}
	
	public enum ACCORDION {
		PANES,
		LINKS
	}
	
	public enum ACCGROUPS {
		APPLICATION,
        TRANSACTION,
        COMPONENT,
        TOPOLOGY,
		ANALYTICS,
		CONFIG
	}
	
	public enum CONFIG {
		// First the Groups
		CONFIG_NOC,
		CONFIG_TOPOLOGY,
		
		// Now the group members
		
		//APPLICATION Screens Group
		APPLICATION_ALERTS,
		TRANSACTION_GRID,
		
		//Topology Group
		APPLICATION_TAGS,
		APPLICATION_LAYERS,
		APPLICATION_TOPOLOGY,
		LAYER_TRANSITIONS,
		COMPONENT_TOPOLOGY
	}
	
	public enum ANALYTICS {
		SQL_DB_OUTLIERS
	}
	
	public enum TOPOLOGY {
		SAMPLE_TOPOLOGY,
		LAYERONE
	}
	
	public enum APPLICATION {
		APPLICATION_ALERTS
	}

    public enum TRANSACTION {
        TRANSACTION_GRID
    }

    public enum COMPONENT {

    }
}


