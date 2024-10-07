import express from "express";
import db from "@repo/db/client"

const app = express();
app.use(express.json());

app.post('/hdfcWebhook' ,async (req,res) => {
    //add zod validation 
    const paymentInformation : {
        token : string,
        userId : string,
        amount : string
    } = { // take this details from the frontnend of the application
        token : req.body.token,
        userId : req.body.user_identifier,
        amount : req.body.amount
    };
    
    try{
        await db.$transaction([ //using transactions so that no two rqsts clash and it can happen that after updating the balance then something went wrong and the onramp didnt update but the balance got updated so we added transaction so that both together happens
            db.balance.updateMany({
                where : {
                    userId : Number(paymentInformation.userId)
                },
                data : {
                    amount : {
                        increment : Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where : {
                    token : paymentInformation.token
                },
                data : {
                    status : "Success"
                }
            })
        ]);
        res.status(200).json({
            message : "captured!!"
        })
    } catch(e){
        console.error(e);
        res.status(411).json({
            message : "error occured in the webhook server"
        })
    }
});

app.listen(3003);