/*
 * XML Type:  paneType
 * Namespace: http://www.extension.ui.appsone.appnomic.com
 * Java type: com.appnomic.appsone.ui.extension.PaneType
 *
 * Automatically generated - do not modify.
 */
package com.appnomic.appsone.ui.extension.impl;
/**
 * An XML paneType(@http://www.extension.ui.appsone.appnomic.com).
 *
 * This is a complex type.
 */
public class PaneTypeImpl extends org.apache.xmlbeans.impl.values.XmlComplexContentImpl implements com.appnomic.appsone.ui.extension.PaneType
{
    private static final long serialVersionUID = 1L;
    
    public PaneTypeImpl(org.apache.xmlbeans.SchemaType sType)
    {
        super(sType);
    }
    
    private static final javax.xml.namespace.QName VIEWLINK$0 = 
        new javax.xml.namespace.QName("http://www.extension.ui.appsone.appnomic.com", "view-link");
    private static final javax.xml.namespace.QName VIEWCONTAINER$2 = 
        new javax.xml.namespace.QName("http://www.extension.ui.appsone.appnomic.com", "view-container");
    private static final javax.xml.namespace.QName LABEL$4 = 
        new javax.xml.namespace.QName("", "label");
    
    
    /**
     * Gets the "view-link" element
     */
    public com.appnomic.appsone.ui.extension.ViewLinkType getViewLink()
    {
        synchronized (monitor())
        {
            check_orphaned();
            com.appnomic.appsone.ui.extension.ViewLinkType target = null;
            target = (com.appnomic.appsone.ui.extension.ViewLinkType)get_store().find_element_user(VIEWLINK$0, 0);
            if (target == null)
            {
                return null;
            }
            return target;
        }
    }
    
    /**
     * True if has "view-link" element
     */
    public boolean isSetViewLink()
    {
        synchronized (monitor())
        {
            check_orphaned();
            return get_store().count_elements(VIEWLINK$0) != 0;
        }
    }
    
    /**
     * Sets the "view-link" element
     */
    public void setViewLink(com.appnomic.appsone.ui.extension.ViewLinkType viewLink)
    {
        generatedSetterHelperImpl(viewLink, VIEWLINK$0, 0, org.apache.xmlbeans.impl.values.XmlObjectBase.KIND_SETTERHELPER_SINGLETON);
    }
    
    /**
     * Appends and returns a new empty "view-link" element
     */
    public com.appnomic.appsone.ui.extension.ViewLinkType addNewViewLink()
    {
        synchronized (monitor())
        {
            check_orphaned();
            com.appnomic.appsone.ui.extension.ViewLinkType target = null;
            target = (com.appnomic.appsone.ui.extension.ViewLinkType)get_store().add_element_user(VIEWLINK$0);
            return target;
        }
    }
    
    /**
     * Unsets the "view-link" element
     */
    public void unsetViewLink()
    {
        synchronized (monitor())
        {
            check_orphaned();
            get_store().remove_element(VIEWLINK$0, 0);
        }
    }
    
    /**
     * Gets the "view-container" element
     */
    public com.appnomic.appsone.ui.extension.ViewContainerType getViewContainer()
    {
        synchronized (monitor())
        {
            check_orphaned();
            com.appnomic.appsone.ui.extension.ViewContainerType target = null;
            target = (com.appnomic.appsone.ui.extension.ViewContainerType)get_store().find_element_user(VIEWCONTAINER$2, 0);
            if (target == null)
            {
                return null;
            }
            return target;
        }
    }
    
    /**
     * True if has "view-container" element
     */
    public boolean isSetViewContainer()
    {
        synchronized (monitor())
        {
            check_orphaned();
            return get_store().count_elements(VIEWCONTAINER$2) != 0;
        }
    }
    
    /**
     * Sets the "view-container" element
     */
    public void setViewContainer(com.appnomic.appsone.ui.extension.ViewContainerType viewContainer)
    {
        generatedSetterHelperImpl(viewContainer, VIEWCONTAINER$2, 0, org.apache.xmlbeans.impl.values.XmlObjectBase.KIND_SETTERHELPER_SINGLETON);
    }
    
    /**
     * Appends and returns a new empty "view-container" element
     */
    public com.appnomic.appsone.ui.extension.ViewContainerType addNewViewContainer()
    {
        synchronized (monitor())
        {
            check_orphaned();
            com.appnomic.appsone.ui.extension.ViewContainerType target = null;
            target = (com.appnomic.appsone.ui.extension.ViewContainerType)get_store().add_element_user(VIEWCONTAINER$2);
            return target;
        }
    }
    
    /**
     * Unsets the "view-container" element
     */
    public void unsetViewContainer()
    {
        synchronized (monitor())
        {
            check_orphaned();
            get_store().remove_element(VIEWCONTAINER$2, 0);
        }
    }
    
    /**
     * Gets the "label" attribute
     */
    public java.lang.String getLabel()
    {
        synchronized (monitor())
        {
            check_orphaned();
            org.apache.xmlbeans.SimpleValue target = null;
            target = (org.apache.xmlbeans.SimpleValue)get_store().find_attribute_user(LABEL$4);
            if (target == null)
            {
                return null;
            }
            return target.getStringValue();
        }
    }
    
    /**
     * Gets (as xml) the "label" attribute
     */
    public org.apache.xmlbeans.XmlString xgetLabel()
    {
        synchronized (monitor())
        {
            check_orphaned();
            org.apache.xmlbeans.XmlString target = null;
            target = (org.apache.xmlbeans.XmlString)get_store().find_attribute_user(LABEL$4);
            return target;
        }
    }
    
    /**
     * True if has "label" attribute
     */
    public boolean isSetLabel()
    {
        synchronized (monitor())
        {
            check_orphaned();
            return get_store().find_attribute_user(LABEL$4) != null;
        }
    }
    
    /**
     * Sets the "label" attribute
     */
    public void setLabel(java.lang.String label)
    {
        synchronized (monitor())
        {
            check_orphaned();
            org.apache.xmlbeans.SimpleValue target = null;
            target = (org.apache.xmlbeans.SimpleValue)get_store().find_attribute_user(LABEL$4);
            if (target == null)
            {
                target = (org.apache.xmlbeans.SimpleValue)get_store().add_attribute_user(LABEL$4);
            }
            target.setStringValue(label);
        }
    }
    
    /**
     * Sets (as xml) the "label" attribute
     */
    public void xsetLabel(org.apache.xmlbeans.XmlString label)
    {
        synchronized (monitor())
        {
            check_orphaned();
            org.apache.xmlbeans.XmlString target = null;
            target = (org.apache.xmlbeans.XmlString)get_store().find_attribute_user(LABEL$4);
            if (target == null)
            {
                target = (org.apache.xmlbeans.XmlString)get_store().add_attribute_user(LABEL$4);
            }
            target.set(label);
        }
    }
    
    /**
     * Unsets the "label" attribute
     */
    public void unsetLabel()
    {
        synchronized (monitor())
        {
            check_orphaned();
            get_store().remove_attribute(LABEL$4);
        }
    }
}
