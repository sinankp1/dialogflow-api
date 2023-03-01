const dialogflow = require("@google-cloud/dialogflow")
require('dotenv').config()
const express = require('express')


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)

const PROJECTID = CREDENTIALS['project_id']

const CONFIGURATION = {
    credentials : {
        private_key: CREDENTIALS['private_key'],
        client_email: CREDENTIALS['client_email']
    }
}

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId)=>{
    let sessionPath = sessionClient.projectAgentSessionPath(PROJECTID, sessionId)

    let request = {
        session: sessionPath,
        queryInput:{
            text: {
                text: queryText,
                languageCode:languageCode,
            }
        }
    }

     const responses = await sessionClient.detectIntent(request)
    
     const result = responses[0].queryResult;

     return {
        response: result.fulfillmentText
     }
}


const webApp = express();

webApp.use(express.json());

const PORT = process.env.PORT || 3000;

webApp.get('/',(req,res)=>{
    res.send('hello world')
})

webApp.post('/dialogflow',async(req,res)=>{
    const {languageCode,queryText,sessionId} = req.body;

    let responseData = await detectIntent(languageCode, queryText, sessionId)

    res.send(responseData.response)
})

webApp.listen(PORT,()=>{
    console.log(`Server is up and running on port ${PORT}`);
})
