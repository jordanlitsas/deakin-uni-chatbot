const replies = {
    initiateConversation:  `I can calculate where you are currently sitting for your assessments. Please enter your mark for each assessment in the following format. The score you achieved / the weight of the assessment`,
    usersAssessments: `Thank-you. Once you have sent all of your assessments please send done.`,
    doneMessage: `I have recieved all of your assessment scores and weight. Calculating averages now.`
}

const initiateConversation = () => {
    return replies.initiateConversation;
}
const getResponse = (newUserMessage, lastUserMessage) => {
    let action = null;
    let value = null;
    if (lastUserMessage == "Estimate" && isInterval(newUserMessage)){
        return {
            message: replies.usersAssessments,
            options: [{action: action, value: value}]
        }
    }

    if (newUserMessage == ""){
            return {
                message: replies.usersAssessments,
                options: [{action: action, value: value}]
            }
        }

    if (newUserMessage == "done"){
        return{
            message: replies.doneMessage,
            options:[{action: gradeCalculator, value: null}]
        };
    }

   
}

function gradeCalculator(){
    var cumulativePoints = 0;
	var cumulativeWeight = 0;
	var currentGrade = 0;
	
    for(var i = 1; i <= scoreCount; i++)
	{
        var scoreType = typeof scoreVal;
		var weightType = typeof weightVal;
		var scoreCount = 0;

        if(scoreVal && weightVal)
		{
			// convert to integer
			scoreVal  = parseFloat(scoreVal, 10);
			weightVal = parseFloat(weightVal, 10) / 100; 
			
			
			scoreType = typeof scoreVal;
			weightType = typeof weightVal;
			
			{
		
				var points = scoreVal * weightVal;
				cumulativePoints += points;
				cumulativeWeight += weightVal;	
			}
			
            currentGrade = Math.round(currentGrade * 100) / 100;
		}
    }
}