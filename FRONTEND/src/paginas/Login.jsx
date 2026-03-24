import React, { useState } from "react";
import { Form, Button, Card, Spinner, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { APP_NAME } from "../helpers/branding";
import logoVerde from "/logoVerde.png";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
const Login = () => {
  const [form, setForm] = useState({ usuarioLogin: "", contraseña: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    if (!form.usuarioLogin.trim() || !form.contraseña.trim()) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({
        usuarioLogin: form.usuarioLogin,
        contraseña: form.contraseña,
      });
      const userData = {
        token: data?.token,
        rol: data?.data?.usuario?.rol,
        nombre: data?.data?.usuario?.nombre,
        id: data?.data?.usuario?._id
      };
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };
  const isUsuarioInvalid = submitted && !form.usuarioLogin.trim();
  const isContraseñaInvalid = submitted && !form.contraseña.trim();
  return (
    <div className="login-page">
      <Card className="login-card border-0">
        <div className="login-top-bar"></div>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <img
              src={logoVerde}
              alt="Logo del sistema"
              className="login-logo"
            />
            <h2 className="fw-bold text-dark mb-1">{APP_NAME}</h2>
            <p className="text-muted small">Ingresá tus credenciales para continuar</p>
          </div>
          {error && (
            <Alert variant="danger" className="login-alert py-2 px-3 small border-0 text-center mb-4">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="usuarioLogin">
              <Form.Label className="login-label">
                Nombre de usuario
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresá tu usuario"
                name="usuarioLogin"
                value={form.usuarioLogin}
                onChange={handleChange}
                isInvalid={isUsuarioInvalid}
                className="login-input py-2 px-3 border-2"
              />
              {isUsuarioInvalid && (
                <div className="text-danger small mt-1 px-1">
                  El usuario es obligatorio.
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-4" controlId="contraseña">
              <Form.Label className="login-label">
                Contraseña
              </Form.Label>
              <InputGroup hasValidation className="login-input-group-password">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="contraseña"
                  value={form.contraseña}
                  onChange={handleChange}
                  isInvalid={isContraseñaInvalid}
                  className="login-input py-2 px-3 border-2 border-end-0"
                />
                <InputGroup.Text
                  className={`login-password-toggle bg-white border-2 border-start-0 ${isContraseñaInvalid ? 'border-danger' : ''}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </InputGroup.Text>
              </InputGroup>
              {isContraseñaInvalid && (
                <div className="text-danger small mt-1 px-1">
                  La contraseña es obligatoria.
                </div>
              )}
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              disabled={loading}
              className="login-submit-btn w-100 py-3 fw-bold shadow-sm border-0 mt-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Iniciando sesión...
                </>
              ) : "Entrar al Sistema"}
            </Button>
          </Form>
        </Card.Body>
        <div className="bg-light py-3 text-center border-top">
          <small className="text-muted">{APP_NAME}</small>
        </div>
      </Card>
    </div>
  );
};
export default Login;
