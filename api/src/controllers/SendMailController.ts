import { getCustomRepository } from 'typeorm';
import { Response, Request } from 'express';
import { resolve } from 'path';

import { SurveyRepository } from '../repositories/SurveyRepository';
import { UserRepository } from '../repositories/UserRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import SendMailService from '../services/SendMailService';

class SendMailController
{
    async execute(request: Request, response: Response)
    {
        const { email, survey_id } = request.body
        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)
        
        const user = await userRepository.findOne({email});
        if(!user) {
            return response.status(400).json({
                error: "User does not exists"
            });
        }

        const survey = await surveyRepository.findOne({id: survey_id});
        if(!survey) {
            return response.status(400).json({
                error: "Survey does no exists"
            });
        }

        const variables = {
            name: user.name, 
            title: survey.title, 
            description: survey.description,
            user_id: user.id, 
            link: process.env.URL_MAIL
        }

        const NPSPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
                where: [{ user_id: user.id} , { value: null }],
                relations: ["user", "survey"]
            });

        if(surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, NPSPath);
            return response.json(surveyUserAlreadyExists);
        }

        //Salvar dados na tabela
        const surveyUser = surveyUserRepository.create({ user_id: user.id, survey_id });
        await surveyUserRepository.save(surveyUser);
        
        //Enviar email para o usuario
        await SendMailService.execute(email, survey.title, variables, NPSPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }