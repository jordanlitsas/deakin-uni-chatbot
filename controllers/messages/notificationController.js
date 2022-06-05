const messageService = require('../../services/messages/messageService');
const unitService = require('./../../services/topic/unitService');
const notificationManager = require('../../messageLogic/messageManager/notificationManager');
const notificationService = require('../../services/topic/notificationService')

const notifyUser = async (req, res) => {
    let psid = req.body.psid;
    console.log("START notifyUser")
    console.log('\nreqbody')
    console.log(req.body)
    let interval = await notificationService.getNotifications(psid);
    interval = interval[0];
    let unitDocs = await unitService.getUnits(psid);

   



    console.log('\nInterval')
    console.log(interval)
    console.log('\npsid')
    console.log(psid)


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
    console.log(messages);

    messages.forEach(async message => {
        console.log(message);
        console.log('\n')
        let requestBody = {
            "recipient": {
              "id": psid
            },
            "message": {"text": message}
          };
        await messageService.callGraphApi(requestBody)
    })


    console.log("from webhook")
    console.log(req.body.fromWebook)
    console.log('\n')

    //I know what you're thinking. It just works, I don't know why.
    if (typeof(req.body.fromWebook) == 'undefined'){
        res.status(200).send({message: "SUCCESS Notification hit"})
    }

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
        let lastUpdated = new Date();
        notificationService.setNotification(psid, interval, lastUpdated);
    }

const getNotificationDocs = async (req, res) => {
    notificationService.getNotifications("directory").then( docs => {
        let psids = [];
        for (let i = 0; i < docs.length; i++){
            psids.push(docs[i].interval);
        }
        res.send({psids: psids});
    })
}
    module.exports = {notifyUser, getNotificationDocs};