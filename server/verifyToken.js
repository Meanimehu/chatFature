import jwt from 'jsonwebtoken'

const verify = async (req,res,next)=> {
    let token
    const {authorization} = req.headers
    if(authorization) {
        token = authorization.split(" ")[1]
        console.log(token)
        jwt.verify(token,process.env.JWT_KEY,(err,user)=> {
            if(err) res.status(403).json("token is not valid")

            req.user = user
            next()

        })
    }else {
        return res.status(401).json("you are not authenticate")
    }
}

const verifyTokenAndAuthorization = (req,res,next)=> {
    verify(req,res,()=> {
        console.log(req.user.id,req.params.id,req.user.isAdmin)
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else {
            return res.status(403).json("you are not allow to do that")
        }
    })
}
const verifyTokenAndAdmin =(req,res,next)=> {
    verify(req,res,()=> {
      console.log("verify")
      const istrue = req.user.isAdmin
      console.log(istrue)
      if(req.user.isAdmin) {
        console.log("it is ok")
        next()
        
      }else {
        res.status(403).json("you are not allowed to do that")
      }
    })
  }

  export {verify, verifyTokenAndAuthorization,verifyTokenAndAdmin}