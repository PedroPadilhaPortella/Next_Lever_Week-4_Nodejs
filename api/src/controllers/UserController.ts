import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class UserController
{
    async create(request: Request, response: Response)
    {
        const { name, email } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const userAlreadyExists = await usersRepository.findOne({ email });

        if(userAlreadyExists) return response.status(400).json({ error: "User Already Exists!"});

        const user = usersRepository.create({ name, email });
        await usersRepository.save(user);

        return response.status(201).json(user);
    }

    async show(request: Request, response: Response) {
        const userRepository = getCustomRepository(UserRepository)

        const all = await userRepository.find();

        return response.json(all);
    }
}

export { UserController };
