package com.appnomic.appsone.strutsejb;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.Interceptor;

/**
 * User: bharadwaj
 * Date: 28/05/13
 * Time: 10:43 AM
 */
public class EJBAnnotationProcessorInterceptor implements Interceptor {
    public String intercept(ActionInvocation ai) throws Exception {
        EJBAnnotationProcessor.process(ai.getAction());
        return ai.invoke();
    }

    public void destroy() {

    }

    public void init() {

    }
}