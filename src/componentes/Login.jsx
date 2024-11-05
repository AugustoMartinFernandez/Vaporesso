import React, { useState } from "react";
import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import appFirebase from "../credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { useCart } from "./CartContext";

const auth = getAuth(appFirebase);

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [recuperarCorreo, setRecuperarCorreo] = useState(false);
  const { loadSavedCart } = useCart();

  const functAutentication = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if (registrando) {
      if (contraseña.length < 8) {
        toast.error("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      const confirmPassword = e.target['confirm-password'].value;
      if (contraseña !== confirmPassword) {
        toast.error("Las contraseñas no coinciden.");
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, correo, contraseña);
        toast.success("Usuario registrado exitosamente.");
      } catch (error) {
        toast.error("Error al registrar usuario. Asegúrate de que el correo sea válido.");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contraseña);
        loadSavedCart();
        toast.success("Inicio de sesión exitoso.");
      } catch (error) {
        toast.error("El correo o la contraseña son incorrectos.");
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    if (correo) {
      try {
        await sendPasswordResetEmail(auth, correo);
        toast.success("Se ha enviado un correo para restablecer la contraseña.");
        setRecuperarCorreo(false);
      } catch (error) {
        toast.error("Error al enviar el correo. Asegúrate de que el correo sea válido.");
      }
    } else {
      toast.error("No se ha ingresado un correo electrónico.");
    }
  };

  return (
    <div className="container login-container">
      <div className="col-md-6 form-section">
        <h2>{registrando ? "Regístrate" : "Inicia sesión"}</h2>
        {recuperarCorreo ? (
          <form onSubmit={handlePasswordReset}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="Ingresa tu Email"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Enviar enlace de recuperación
            </button>
            <button onClick={() => setRecuperarCorreo(false)} className="btn btn-link text-primary mt-2">
              Volver al inicio de sesión
            </button>
          </form>
        ) : (
          <form onSubmit={functAutentication}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="Ingresa tu Email"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>
            {registrando && (
              <div className="form-group">
                <label htmlFor="confirm-password">Confirma tu Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    id="confirm-password"
                    className="form-control"
                    placeholder="Confirma tu contraseña"
                    required
                  />
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              <FaSignInAlt /> {registrando ? "Registrarse" : "Iniciar sesión"}
            </button>
            <p className="toggle-form mt-3">
              {registrando ? "¿Ya tienes una cuenta? " : "¿No tienes cuenta? "}
              <span onClick={() => setRegistrando(!registrando)}>
                {registrando ? "Inicia sesión" : "Regístrate"}
              </span>
            </p>
            <button onClick={() => setRecuperarCorreo(true)} className="btn btn-link text-primary" style={{ color: 'purple' }}>
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;