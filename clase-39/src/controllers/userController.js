import User from "../models/userModel.js";

//Controladores: Actua como intermediario entre el cliente y la logica de la aplicacion. Recibe solicitudes, las procesa y devuelve la respuesta.
//Estos controladores incluyen a los servicios

export const create = async (req, res) => {
  try {
    //Tomar los datos enviados del post
    //Que llegan por body
    const userData = new User(req.body);

    //Destructuramos y obtenemos el email
    const { email } = userData;

    //Validar que el email no sea repetido
    const userExist = await User.findOne({ email });
    //En el objeto escribimos clave: valor, si la clave y el valor se llaman igual, podemos escribirlo una sola vez.
    //Respondemos con un codigo y mensaje
    if (userExist) {
      return res
        .status(400)
        .json({ message: `User with email: ${email} already exists` });
    }

    //Si el email no existe, guardamos el usuario en la db
    await userData.save();

    //201 significa que se ha creado un recurso
    res.status(201).json({ message: "User created" });
  } catch (error) {
    //500 es un error generico del servidor
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const get = async (req, res) => {
  try {
    const users = await User.find();
    //Nos aseguramos que tenga datos
    if (users.length === 0) {
      //204 No Content: la petición se ha procesado con éxito, pero el resultado está vacío.
      return res.status(204).json({ message: "There are no users" });
    }
    //200 significa que la operacion ha sido exitosa
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
