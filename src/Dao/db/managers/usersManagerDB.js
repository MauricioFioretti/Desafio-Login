import { User } from "../models/users.modelDB.js"
import { createHash, isValidatePassword } from '../../../config/bcrypt.js'

export class UserManager {
    // Método para agregar un nuevo usuario a la bd.
    async addUser(newUser) {
        try {
            newUser.password = createHash(newUser.password)
            let result = await User.create(newUser)
            return { success: true, message: `El usuario ${newUser.user} ha sido agregado correctamente`, data: newUser, result: result }
        }
        catch (error) {
            // Captura y manejo de errores durante la adición de un usuario.
            return { success: false, message: `Error al agregar el usuario. `, error: error }
        }
    }

    // Método para obtener todos los productos.
    async getUsers() {
        try {
            return await User.find()
        }
        catch (error) {
            // Captura y manejo de errores durante la peticion de los usuarios.
            return { success: false, message: `Error al obtener los usuarios. `, error: error }
        }
    }

    // Método para obtener un producto por su ID.
    async getUserByEmail(email, password) {

        if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
            password = createHash(password)
            let userAdmin = { user: 'Admin', email, password }
            return { success: true, message: `El usuario con email: ${email} se encontró exitosamente.`, data: userAdmin }

        } else {
            try {
                let busquedaPorEmail = await User.findOne({ email })

                if (busquedaPorEmail && isValidatePassword(password, busquedaPorEmail.password)) {
                    return { success: true, message: `El usuario con email: ${email} se encontró exitosamente.`, data: busquedaPorEmail }
                } else if (busquedaPorEmail && password == busquedaPorEmail.password) {
                    return { success: true, message: `El usuario con email: ${email} se encontró exitosamente.`, data: busquedaPorEmail }
                } else {
                    throw new Error(`El usuario o contraseña son incorrectos.`)
                }

            } catch (error) {
                // Captura y manejo de errores durante la obtención de un usuario por email y contra.
                return { success: false, message: `Error al obtener el usuario. `, error: error }
            }
        }
    }

    // Método para obtener un producto por su ID.
    async getUserByGithub(profile) {
        try {
            let email = profile.email
            let name = profile.name

            if (!email) {
                email = profile.id + '@gmail.com'
            } if (!name) {
                name = profile.login
            }

            let userDeGithub = await User.findOne({ email })

            if (userDeGithub) {
                return { success: true, message: `El usuario con email: ${email} se encontró exitosamente.`, data: userDeGithub }
            } else {
                userDeGithub = await User.create({
                    user: name,
                    email: email,
                    password: createHash('passwordGithub123.')
                })
                return { success: true, message: `El usuario con email: ${email} se encontró exitosamente.`, data: userDeGithub }
            }
        } catch (error) {
            // Captura y manejo de errores durante la obtención de un usuario por email y contra.
            return { success: false, message: `Error al obtener el usuario. `, error: error }
        }
    }

    // Método para obtener un producto por su ID.
    async getUserById(id) {
        try {
            return await User.findById(id)
        } catch (error) {
            return 'Usuario no encontrado'
        }
    }
}   

// Exportación de la clase ProductManager para su uso en otros módulos.
export default { UserManager }
