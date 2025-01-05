import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Cuenta creada exitosamente");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Inicio de sesión exitoso");
      }
      navigate(from);
    } catch (error) {
      console.error(error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        toast.error("Correo o contraseña incorrectos");
      } else {
        toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Por favor, ingresa tu correo electrónico");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Se ha enviado un correo para restablecer tu contraseña");
      setIsResettingPassword(false);
    } catch (error) {
      console.error(error);
      toast.error(
        "Error al enviar el correo de recuperación. Verifica tu dirección de correo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-info-section">
        <div className="info-content">
          <h1>Bienvenidos a <span style={{color:"#8a2be2",fontWeight:"900"}}>N</span>eo<span style={{color:"#8a2be2",fontWeight:"800"}}>V</span>ape</h1>
          <p className="login-intro">
            Para proceder con la compra, debes iniciar sesión por medidas de seguridad. <br /> Disfruta de una experiencia personalizada y segura.
          </p>
          <div className="security-info">
            <h3>Seguridad y Privacidad</h3>
            <ul>
              <li>🔒Tu información personal está protegida con encriptación de última generación.</li>
              <li>🔒Utilizamos autenticación segura para proteger tu cuenta.</li>
              <li>🔒Nunca compartiremos tus datos con terceros sin tu consentimiento.</li>
              <li>🔒Accede a nuestra amplia selección de productos una vez que inicies sesión.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="login-form-section">
        <div className="login-container">
          <h2>{isRegistering ? "Crea tu cuenta" : "Inicia sesión"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa tu correo electrónico"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Procesando..." : isRegistering ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          </form>
          <div className="auth-options">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="btn btn-link"
              disabled={loading}
            >
              {isRegistering
                ? "¿Ya tienes una cuenta? Inicia sesión"
                : "¿No tienes una cuenta? Regístrate"}
            </button>
            {!isRegistering && (
              <button
                onClick={() => setIsResettingPassword(true)}
                className="btn btn-link"
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>
          {isResettingPassword && (
            <div className="reset-password">
              <h3>Restablecer contraseña</h3>
              <p>
                Ingresa tu correo electrónico para recibir un enlace de
                restablecimiento de contraseña.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
              />
              <button onClick={handleResetPassword} className="btn btn-secondary" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace de restablecimiento"}
              </button>
              <button
                onClick={() => setIsResettingPassword(false)}
                className="btn btn-link"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;


// CODIGO NO ACTUALIZADO