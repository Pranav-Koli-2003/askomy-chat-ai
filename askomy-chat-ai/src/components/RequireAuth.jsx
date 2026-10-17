import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { verify_user } from "../api/api_link";
import { deleteToken, getToken, getTokenExpiry } from "../api/token";

// Put this component around every page that requires login.
export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let active = true;
    const { access } = getToken();

    if (!access) {
      setChecked(true);
      setValid(false);
      return;
    }

    const expiry = getTokenExpiry();
    let timer;
    if (expiry !== null) {
      const remaining = expiry - Date.now();
      if (remaining <= 0) {
        deleteToken();
        setChecked(true);
        setValid(false);
        return;
      }
      timer = window.setTimeout(() => {
        deleteToken();
        navigate("/Login", { replace: true });
      }, remaining);
    }

    async function verify() {
      try {
        const result = await verify_user();
        if (!active) return;
        const ok = result?.user_verified === "True";
        setValid(ok);
        if (!ok) deleteToken();
      } catch {
        if (!active) return;
        deleteToken();
        setValid(false);
      } finally {
        if (active) setChecked(true);
      }
    }
    verify();

    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [navigate]);

  if (!checked) return <h2>Checking login...</h2>;
  if (!valid) return <Navigate to="/Login" replace />;
  return children;
}
