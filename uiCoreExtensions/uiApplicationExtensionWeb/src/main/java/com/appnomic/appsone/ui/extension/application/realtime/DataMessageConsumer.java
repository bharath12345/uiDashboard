package com.appnomic.appsone.ui.extension.application.realtime;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jms.*;

/**
 * Abstract class to act as template for all JMS Consumers
 * User: sumanthn
 * Date: 8/4/13
 */
// one might wonder why not use Spring JMS, Spring JMS message has many hidden
    //anti-patterns so not using it anywhere
//TODO: add more validation
public abstract class DataMessageConsumer {
    private static final Logger logger = LoggerFactory.getLogger(DataMessageConsumer.class.getName());

    protected static String brokerURL = null;// MessageBroker.getInstance().brokerURL;
    protected static transient ConnectionFactory factory;
    protected transient Connection connection;
    protected transient Session session;
    protected Destination destination;

    protected final void init(final String brokerURL, final String topicName, final MessageListener messageHandler){
        try{
            this.brokerURL = brokerURL;
            factory = new ActiveMQConnectionFactory(brokerURL);
            connection = factory.createConnection();
            connection.start();

            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

            destination = session.createTopic(topicName);
            MessageConsumer messageConsumer  = session.createConsumer(destination);

            messageConsumer.setMessageListener(messageHandler);



        }catch (Exception e){
            e.printStackTrace();
        }


    }


    //the only downside is that client has to know about SQL selector string
    protected final void init(final String brokerURL, final String topicName, final String selectorStr,final MessageListener messageHandler){
        try{
            this.brokerURL = brokerURL;
            factory = new ActiveMQConnectionFactory(brokerURL);
            connection = factory.createConnection();
            connection.start();

            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

            destination = session.createTopic(topicName);

            //can also use IN operator
            //APPID IN '1'
            // String selector = "TXNID = '1'";


            MessageConsumer messageConsumer = session.createConsumer(destination,selectorStr);
            //MessageConsumer messageConsumer  = session.createConsumer(destination);

            messageConsumer.setMessageListener(messageHandler);



        }catch (Exception e){
            e.printStackTrace();
        }


    }

    public void shutdown(){
        try {
            connection.close();
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }


}
