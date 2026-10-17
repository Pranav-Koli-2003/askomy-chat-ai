import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verify_user } from "../api/api_link";
import { deleteToken, getToken, getTokenExpiry } from "../api/token";

function Auto_login() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function checkToken() {
      const { access } = getToken();
      if (!access) {
        navigate("/Login", { replace: true });
        return;
      }
      try {
        const result = await verify_user();
        if (!active) return;
        if (result?.user_verified === "True") {
          navigate("/Askomy_Ai", { replace: true });
        } else {
          deleteToken();
          navigate("/Login", { replace: true });
        }
      } catch (error) {
        if (active) {
          deleteToken();
          navigate("/Login", { replace: true });
        }
      }
    }
    checkToken();
    return () => { active = false; };
  }, [navigate]);

  return <h2>Checking login...</h2>;
}

export default Auto_login;
