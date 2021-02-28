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
            throw new AppError("User does no exists", 400);
        }

        const survey = await surveyRepository.findOne({id: survey_id});
        if(!survey) {
            throw new AppError("Survey does no exists", 400);
        }

        const NPSPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        
        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists) {
            variables.id =  surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, NPSPath);
            return response.json(surveyUserAlreadyExists);
        }

        //Salvar dados na tabela
        const surveyUser = surveyUserRepository.create({ user_id: user.id, survey_id });
        await surveyUserRepository.save(surveyUser);

        
        //Enviar email para o usuario
        variables.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, NPSPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }