import { user_login } from '../api/api_link'
import { saveToken } from '../api/token';
import { toast } from 'react-toastify';

async function Login_token(data,navigate) {
    
    const user_verify = await user_login(data)

    if(user_verify.value == "True"){
      // save jwt token using api
      const token =  user_verify.jwt_tokens

      saveToken(token)

      // login message
      
      toast.success(user_verify.message)
      // go to askomy chat page
      navigate('/Askomy_Ai', { replace: true }); 

      return user_verify.message;
    }
    else{
        toast.error(user_verify.message);
        return user_verify.message
    }   
  
}

export default Login_token