const messageService = require('../messages/messageService');
const unitService = require('./unitService');
const notificationManager = require('../../messageLogic/messageManager/notificationManager');


    /**
     *  NEED
     *      end_date
     *      current date
     *      interval
     *      
     *      title
     *      description
     *      weight
     *      date/time
     * 
    // let unitCode = unitDocs.substring(unitDocs.indexOf("unit_name")+12, unitDocs.indexOf("unit_name")+18 );
    // let i1 = unitDocs.indexOf("assessments");
    // let i2 = unitDocs.indexOf("]");
    // unitDocs = `{"unitCode": "${unitCode}",`+unitDocs.substring(i1-1, i2+1)+"}";

     * 
     */

const notifyUser = async (psid, interval) => {
    console.log("START notifyUser")
    let unitDocs = await unitService.getUnits(psid);

    //clean \r\n from string
    unitDocs = unitDocs.replace(/(\r\n|\n|\r)/gm, "");
    try{
        unitDocs = JSON.parse(unitDocs)
    }
    catch(e){
        console.log('>>>',e)
    }

    let currentDay = new Date().getDate();
    let currentMonth = new Date().getMonth()-1;
    let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let responseObj = {units: []};
    let assessmentMessage = {};

    //extract information into assessment card objects
    unitDocs.forEach(doc => {
        let obj = {unitName: doc.unit_name, assessments: []};
        // console.log(doc)

        doc.assessments.forEach(assessment => {



            if (assessment.end_date == ""){
                if (assessment.interval == "Once"){
                    assessmentMessage = {
                        name: assessment.name, 
                        output: assessment.output, 
                        weight: `${assessment.value*100}%`,
                        due: "Sometime in the future - check your unit guide for this one, sorry."
                    };
                    obj.assessments.push(assessmentMessage)
                } else if (assessment.interval == "Weekly"){
                    assessmentMessage = {
                        name: assessment.name, 
                        output: assessment.output, 
                        weight: `${assessment.value*100}%`,
                        due: "Happening this week."
                    };
                    obj.assessments.push(assessmentMessage)
                }
            } else {
                if (interval == "week"){
                    if (assessment.end_date.includes(months[currentMonth])){

                        let startIndex = assessment.end_date.indexOf(months[currentMonth])-3;
                        let endIndex = assessment.end_date.indexOf(months[currentMonth]);
                        let day = assessment.end_date.substring(startIndex, endIndex);
                        day = day.trim();
                        if (day > currentDay){
                            if (day - currentDay <=7){
                                if (assessment.end_date == ""){
                                    assessmentMessage = getNoDueDateObject(assessment)
                                } else {
                                    assessmentMessage = {
                                        name: assessment.name, 
                                        output: assessment.output, 
                                        weight: `${assessment.value*100}%`,
                                        due: assessment.end_date
                                    };
                                }
                               
                                obj.assessments.push(assessmentMessage)
                            }
                        }
    
                    }
                }
       
                if (assessment.end_date.includes(months[currentMonth])){
                        let startIndex = assessment.end_date.indexOf(months[currentMonth])-3;
                        let endIndex = assessment.end_date.indexOf(months[currentMonth]);
                        let day = assessment.end_date.substring(startIndex, endIndex);
                        day = day.trim();
                        if (day > currentDay){
                            if (day - currentDay <=14){
                                if (assessment.end_date == ""){
                                    assessmentMessage = getNoDueDateObject(assessment)
                                } else {
                                    assessmentMessage = {
                                        name: assessment.name, 
                                        output: assessment.output, 
                                        weight: `${assessment.value*100}%`,
                                        due: assessment.end_date
                                    };
                                }
                                obj.assessments.push(assessmentMessage)
                            }
                        }
    
                    }
                
                if (interval == "month"){
                    if (assessment.end_date.includes(months[currentMonth])){
                        if (assessment.end_date == ""){
                            assessmentMessage = getNoDueDateObject(assessment)
                        } else {
                            assessmentMessage = {
                                name: assessment.name, 
                                output: assessment.output, 
                                weight: `${assessment.value*100}%`,
                                due: assessment.end_date
                            };
                        }
                        obj.assessments.push(assessmentMessage);
                    }
                }
            }  
        });
        responseObj.units.push(obj);
        assessmentMessage = {};
    })

    let messages = [];
    
    responseObj.units.forEach(unit => {
        messages.push(unit.unitName)
        unit.assessments.forEach(assessment => {
            let message = notificationManager.buildAssessmentNotificationMessage(assessment);
            messages.push(message);
        })
    })
    // Plug assessment cards into message builder

    messages.forEach(async message => {
        let requestBody = {
            "recipient": {
              "id": psid
            },
            "message": {"text": message}
          };
        await messageService.callGraphApi(requestBody)
    })

    return null;

}

const getNoDueDateObject = (assessment) => {
    let assessmentMessage;   
    if (assessment.interval == "Once"){
            assessmentMessage = {
                name: assessment.name, 
                output: assessment.output, 
                weight: `${assessment.value*100}%`,
                due: "Sometime in the future - check your unit guide for this one, sorry."
            };
            obj.assessments.push(assessmentMessage)
        } else if (assessment.interval == "Weekly"){
            assessmentMessage = {
                name: assessment.name, 
                output: assessment.output, 
                weight: `${assessment.value*100}%`,
                due: "Happening this week."
            };
            return assessmentMessage;
            
        }
    }



module.exports = {notifyUser};