import userModel from "../models/user.model.js";

class UserManager{

    static #instance;

    static getInstance(){
        if(!ProductsManager.#instance){
            ProductsManager.#instance = new ProductsManager()
        }
        return ProductsManager.#instance
    }

    async register(newUserInfo) {
        try {
            const firstName = newUserInfo.firstName;
            const lastName = newUserInfo.lastName;
            const email = newUserInfo.email;
            const age = newUserInfo.age;
            const password = newUserInfo.password;
            
            const user = await userModel.create({
                firstName,
                lastName,
                email,
                age,
                password
            });
            
            return user.save();
        } catch (error) {
            if (error.errors) {
                const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
                return `Validation error: ${errorMessage}`;
            } else if (error.code === 11000) {
                return true
            } else {
                console.error(error);
                return 'Internal server error';
            }
        }
    }
    

    async login(userCredentials, userSession){
        try {
            const email = userCredentials.email
            const password = userCredentials.password 
            const user = await userModel.findOne({email, password});
            
            if (!user) {
              return 'error'
            }
            
            userSession.user = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              age: user.age,
              role: user.role
            };
        
            if(userCredentials.email === "adminCoder@coder.com" && userCredentials.password === "adminCod3r123"){
              user.role = 'admin'
              await user.save()
              return `/products?username=${userSession.user.firstName}`
            }else{
              user.role = 'user'
              await user.save()
              return `/products?username=${userSession.user.firstName}`
            }
          } catch (error) {
            return error
          }
    }
}

const userManager = new UserManager

export default userManager


