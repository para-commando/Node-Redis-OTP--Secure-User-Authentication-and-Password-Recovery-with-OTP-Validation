const {processes} = require('../Processes/process');
const logger = require ('../../../shared/src/configurations/logger.configurations')
module.exports.processMappers = {
    process1: async (asd)=>{
        try {
            logger.info(`This is the function argument : ${asd}`);
            
            logger.warn('This is a warning message.');
       const processResponse= await processes.coreProcess1(asd)
       return processResponse;
        }
        catch (err) {
            logger.error('This is an error object: ',err);
        }
    },
}
