package com.appnomic.appsone.strutsejb;

import java.lang.reflect.Field;
import javax.ejb.EJB;
import javax.naming.Context;
import javax.naming.InitialContext;

/**
 * You annotate your EJB, TestSession, as below;
 *
 * @Stateless(name="TestSession", mappedName="TestSession")
 * @Remote
 * @Local
 * public class TestSession implements TestInterface{
 * }
 *
 * You use TestSession in your action or custom validator as below:
 *
 *  @EJB(mappedName="TestSession")
 *  private TestInterface test;
 *
 *	public void setTest(TestInterface test){
 *		this.test = test;
 *	}
 */
public class EJBAnnotationProcessor {

    private EJBAnnotationProcessor(){}

    public static void process(Object instance)throws Exception{

        Field[] fields = instance.getClass().getDeclaredFields();
        if(fields != null && fields.length > 0){
            EJB ejb;
            Context cxt = null;
            String jndiName;
            for(Field f : fields){
                ejb = f.getAnnotation(EJB.class);
                if(ejb != null){
                    if(cxt == null){
                        cxt = new InitialContext();
                    }
                    jndiName = getWeblogicJndiName(f,ejb);
                    System.out.println("weblogic jndi name = " + jndiName);

                    jndiName = getJBossJndiName(f,ejb);
                    System.out.println("jboss jndi name = " + jndiName);

                    f.setAccessible(true);
                    f.set(instance, cxt.lookup(jndiName));
                }
            }
        }
    }

    /**
     * Return the jndi lookup name for Weblogic.
     * Override this method for your application server.
     */
    private static String getWeblogicJndiName(Field field,EJB ejb){
        String className  = field.getType().getName();
        String mappedName = ejb.mappedName();
        if(mappedName != null && mappedName.trim().length() > 0){
            return mappedName + "#" + className;
        }
        return className;
    }

    private static String getJBossJndiName(Field field,EJB ejb){
        String className  = field.getType().getName();
        String mappedName = ejb.mappedName();
        if(mappedName != null && mappedName.trim().length() > 0){
            return mappedName + "#" + className;
        }
        return className;
    }
}
