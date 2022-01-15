let { tables } = require('@architect/functions')
let arc = require('@architect/functions')
const auth = require('@architect/shared/auth')
const Joi = require('joi');

const failedResponse = require('@architect/shared/failed-response')

const vehicleSchema = Joi.object({
  id: Joi.string().min(3).required(),
  name: Joi.string().min(3).required()
});


exports.handler = arc.http.async(auth, handler) 

async function handler (req) {
  const vehicle = req.body
  const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

  const { error, value  } = vehicleSchema.validate(vehicle, options);
  if(error) {
    return failedResponse({statusCode: 400, body: error})
  }
  const data = await tables()

  const v = await data.vehicles.put({
    userId: req.user.userId,
    name: value.name,
    vehicleId: value.id
  })

  return {
    statusCode: 201,
    cors:true,
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify(v)
  }
}