package com.appnomic.appsone.ui.extension.application.servlet;

import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

/**
 * User: bharadwaj
 * Date: 13/04/13
 * Time: 11:51 AM
 */
public class ExtensionServlet extends HttpServlet {

    protected void service(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("APPLICATION/xml");

        /*ApplicationContext ctx = new ClassPathXmlApplicationContext();
        Resource uiExtnResource = ctx.getResource("classpath:uiApplicationExtension.xml");
        InputStream xmlStream = uiExtnResource.getInputStream();

        PrintWriter out = response.getWriter();
        out.print(IOUtils.toString(xmlStream, "UTF-8"));
        out.flush();

        xmlStream.close();*/

    }
}
