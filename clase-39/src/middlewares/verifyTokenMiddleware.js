import { verifyToken } from "../utils/verifyToken.js";

export const verifyTokenMiddleware = (req, res, next) => {
    
    try {

        const token = req.session.token

        console.log({toke: token})

        if(!token){
            return res.status(400).json({ message: "Token de acceso no proporcionado" })
        }

        const decoded = verifyToken(token)

        console.log({decoded})

        req.user = decoded

        next();    

    } catch (error) {
        return res.status(400).json({message: "Token de acceso invalido", error})
    }
}