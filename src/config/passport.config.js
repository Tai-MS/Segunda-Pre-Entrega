import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import userService from '../DAO/models/user.model.js'
import bcrypt from 'bcrypt'

const LocalStrategy = local.Strategy
const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

const initializePassport = () => {
    passport.serializeUser((user, done)=>{
        done(null, user)
    })
    
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async(req, username, password, done) => {
            const {firstName, lastName, email, age} = req.body
            try {
                let user = await userService.findOne({email:username})
                if(user){
                    console.log('Already exists');
                    return done(null, false)
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userService.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('Error '+error)
            }
        }
    ))
    
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username,password, done) => {
        try {
            const user = await userService.findOne({email:username})
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!user){
                return done (null, false)
            }
            if(user.role === 'admin' && isPasswordValid){
                let role = user.role
                return done(null, user)
            }
            if(!isPasswordValid)return done (null, false)
            return done(null, user)
        } catch (error) {
            return done('Error ' + error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.def19ccb9e3217b2",
        clientSecret: "81294663e507a70dec65db012fcefd438c9df005", 
        callbackURL: "http://localhost:8080/api/sessions/auth/github/callback"
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({email: profile._json.email})
            if(!user){
                let newUser = {
                    email: profile._json.email,
                    firstName: profile._json.name.split(' ')[0],
                    lastName: profile._json.name.split(' ')[1] || (profile._json.name.split(' ')[1] ? lastName : undefined),
                    age: 18,
                    password: ' ', // Considera cambiar esto por una contraseña válida
                }
                let result = await userService.create(newUser)
                done(null, newUser['firstName'])
                // done(null, result.firstName)
            }else{
                done(null, profile._json.name.split(' ')[0])
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.deserializeUser(async (id, done) => {
        try {

            const user = await userService.findById(id);
            if (!user) {

                return done(new Error('User not found'));
            }
            done(null, user._id);
        } catch (error) {
            done(error);
        }
    });
}

export default initializePassport

