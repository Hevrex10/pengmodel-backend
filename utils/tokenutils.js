import jwt from 'jsonwebtoken'

export default function generateToken(id){
  return jwt.sign({id:id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}