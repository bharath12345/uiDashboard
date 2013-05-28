package com.appnomic.appsone.strutsejb;

import java.util.List;
import com.opensymphony.xwork2.validator.AnnotationActionValidatorManager;
import com.opensymphony.xwork2.validator.Validator;

public class EJBAnnotationProcessorValidatorManager extends AnnotationActionValidatorManager{

    @Override
    public List<Validator> getValidators(Class clazz,String context,String method){

        List<Validator> validators = super.getValidators(clazz,context,method);
        for(Validator v : validators){
            try{
                EJBAnnotationProcessor.process(v);
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return validators;
    }
}
