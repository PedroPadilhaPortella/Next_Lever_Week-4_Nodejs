import { Response, Request } from 'express';
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController
{
    //http://localhost:3333/answers/7?u=dcee61ce-9c5a-4a1b-a46c-5b337fcf8d95
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);
        const surveyUser = await surveyUserRepository.findOne({ id: u.toString() });

        if(!surveyUser) {
            throw new AppError("Survey User does not exists!", 400);
        }

        surveyUser.value = Number(value);

        await surveyUserRepository.save(surveyUser);

        return response.status(200).json(surveyUser);
    }
}

export { AnswerController };