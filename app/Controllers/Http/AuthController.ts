import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from 'App/Models/User'

export default class AuthController {

    public async login({ request, response, auth  }: HttpContextContract) {
        try {
            const email = request.input("email");
            const password = request.input("password");

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "1 days",
            });

            response.status(200).json({
                status: 200,
                msg: "Login Successfully",
                token: token
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }

    public async register({ request, response, auth }: HttpContextContract) {
        try {
            const email = request.input("email");
            const password = request.input("password");
            const name = request.input("name");
    
            const newUser = new User();
    
            newUser.name = name;
            newUser.email = email;
            newUser.password = password;
    
            await newUser.save();
    
            const token = await auth.use("api").login(newUser, {
                expiresIn: "1 days",
            });
    
            response.status(200).json({
                status: 200,
                msg: "Register Successfully",
                token: token
            })
        } catch (error) {
            response.status(401).json({
                status: 401,
                msg : error.message
            })
        }
    }
}
