import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Cuenta creada exitosamente");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Inicio de sesión exitoso");
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error("Correo o contraseña incorrectos");
      } else {
        toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Por favor, ingresa tu correo electrónico");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Se ha enviado un correo para restablecer tu contraseña");
      setIsResettingPassword(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar el correo de recuperación. Verifica tu dirección de correo.");
    }
  };

  return (
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
        <button type="submit" className="btn btn-primary">
          {isRegistering ? "Crear cuenta" : "Iniciar sesión"}
        </button>
      </form>
      <div className="auth-options">
        <button onClick={() => setIsRegistering(!isRegistering)} className="btn btn-link">
          {isRegistering ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes una cuenta? Regístrate"}
        </button>
        {!isRegistering && (
          <button onClick={() => setIsResettingPassword(true)} className="btn btn-link">
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </div>
      {isResettingPassword && (
        <div className="reset-password">
          <h3>Restablecer contraseña</h3>
          <p>Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
          />
          <button onClick={handleResetPassword} className="btn btn-secondary">
            Enviar enlace de restablecimiento
          </button>
          <button onClick={() => setIsResettingPassword(false)} className="btn btn-link">
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;