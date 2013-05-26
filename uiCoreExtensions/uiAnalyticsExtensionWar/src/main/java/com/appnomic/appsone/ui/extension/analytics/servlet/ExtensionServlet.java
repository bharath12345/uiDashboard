package com.appnomic.appsone.ui.extension.analytics.servlet;

import org.apache.commons.io.IOUtils;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;

/**
 * User: bharadwaj
 * Date: 13/04/13
 * Time: 11:51 AM
 */
public class ExtensionServlet extends HttpServlet {

    protected void service(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            ServletContext context = getServletContext();
            response.setContentType("APPLICATION/xml");

            URL resourceUrl = Thread.currentThread().getContextClassLoader().getResource("uiAnalyticsExtension.xml");
            FileInputStream resourceStream = new FileInputStream(new File(resourceUrl.toURI()));
            System.out.println("from fileinputstream = " + IOUtils.toString(resourceStream, "UTF-8"));

            InputStream is = context.getResourceAsStream("/WEB-INF/classes/uiAnalyticsExtension.xml");
            System.out.println("from inputstream = " + IOUtils.toString(is, "UTF-8"));

            PrintWriter out = response.getWriter();
            out.print(IOUtils.toString(resourceStream, "UTF-8"));
            out.flush();

            resourceStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

