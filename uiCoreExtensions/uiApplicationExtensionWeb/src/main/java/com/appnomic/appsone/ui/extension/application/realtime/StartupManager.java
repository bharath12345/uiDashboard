package com.appnomic.appsone.ui.extension.application.realtime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;

/**
 * User: sumanthn
 * Date: 6/5/13
 */
@Singleton
@Startup
public class StartupManager {

    private static final Logger logger = LoggerFactory.getLogger(StartupManager.class.getName());
    private AlertDataRcvr alertDataRcvr;

    @PostConstruct
    public void init(){
        DelayedJMSStartupThread delayedJMSStartupThread =  new DelayedJMSStartupThread();
        delayedJMSStartupThread.start();
    }

    private class DelayedJMSStartupThread extends  Thread{
        @Override
        public void run(){
            try {
                Thread.sleep(5*1000);

                alertDataRcvr = new AlertDataRcvr();
                alertDataRcvr.init();
                //TODO: add shutdown hook
                Runtime.getRuntime().addShutdownHook(new Thread (new Runnable() {
                    @Override
                    public void run() {
                      alertDataRcvr.shutdown();
                    }
                }));
            } catch (InterruptedException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }


        }
    }


}
