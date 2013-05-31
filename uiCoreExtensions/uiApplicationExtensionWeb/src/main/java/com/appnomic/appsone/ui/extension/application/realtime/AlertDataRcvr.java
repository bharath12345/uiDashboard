package com.appnomic.appsone.ui.extension.application.realtime;

import com.appnomic.model.AlertData;
import com.appnomic.nameutil.TopicNames;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jms.*;

/**
 * User: sumanthn
 * Date: 15/4/13
 */
public class AlertDataRcvr extends DataMessageConsumer {

    private static final Logger logger = LoggerFactory.getLogger(AlertDataRcvr.class.getName());

    private static transient ConnectionFactory factory;
    private transient Connection connection;
    private transient Session session;
    private transient MessageProducer producer;
    private Destination destination;


    public void init(){
        init(TopicNames.BROKER_URL, TopicNames.ALERT_TOPIC_NAME, new AlertRcvr());

        try {
            factory = new ActiveMQConnectionFactory(TopicNames.BROKER_URL);
            connection = factory.createConnection();
            connection.start();
            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            destination  = session.createTopic(Topics.ALERT_JSON_TOPIC_NAME);
            producer = session.createProducer(destination);
            producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private class AlertRcvr implements MessageListener {
        @Override
        public void onMessage(Message message) {

            ObjectMessage objMsg = (ObjectMessage) message;
            try {
               AlertData txnAlert = (AlertData) objMsg.getObject();
                logger.info("Txn alert received for " +  txnAlert.getTxnName());

                String alertJson = convertToJson(txnAlert);
                Message msg = session.createTextMessage(alertJson);
                producer.send(msg);

            } catch (JMSException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }
    }

    private String convertToJson(AlertData txnAlert) {
        String msgText = new StringBuffer()
                .append("{")
                .append("\"appName\": \"" + txnAlert.getAppName() + "\",\n")
                .append("\"txnName\": \"" + txnAlert.getTxnName() + "\",\n")
                .append("\"message\": " + txnAlert.getMessage() + ",\n")
                .append("\"id\": " + txnAlert.getId() + "")
                .append("}\n")
                .toString();
        System.out.println(msgText);
        return msgText;
    }

}
