import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import appFirebase from "../credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
const auth = getAuth(appFirebase);
const Login = () => {
  const [registrando, setRegistrando] = useState(false);

  const functAutentication = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if (registrando) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contraseña);
      } catch (error) {
        alert("Asegurese que la contraseña tenga mas de 8 caracteres");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contraseña);
      } catch (error) {
        alert("El correo o la contraseña son incorrectos");
      }
    }
  };

  return (
    <div className="container login-container">

        {/* Formulario de Login/Registro */}
        <div className="col-md-6 form-section">
          <h2>{registrando ? "Regístrate" : "Inicia sesión"}</h2>
          <form onSubmit={functAutentication}>
            {/* Input de email */}
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

            {/* Input de contraseña */}
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

            {/* Input de confirmación de contraseña (solo en registro) */}
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

            {/* Botón de submit */}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              <FaSignInAlt /> {registrando ? "Registrarse" : "Iniciar sesión"}
            </button>
          </form>

          {/* Enlace para alternar entre Login y Registro */}
          <p className="toggle-form mt-3">
            {registrando ? "¿Ya tienes una cuenta? " : "¿No tienes cuenta? "}
            <span onClick={() => setRegistrando(!registrando)}>
              {registrando ? "Inicia sesión" : "Regístrate"}
            </span>
          </p>
        </div>
      </div>
  );
};

export default Login;
