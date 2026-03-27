const { loginBD, refreshTokenBD, logoutBD } = require("../services/auth.services");

const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "rtoken";

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth/refresh",
    maxAge: parseMaxAge(process.env.REFRESH_TOKEN_TTL || "7d"),
  };
}

function parseMaxAge(ttl) {
  const match = String(ttl).match(/^(\d+)([mhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const n = parseInt(match[1], 10);
  const unit = match[2];
  if (unit === "m") return n * 60 * 1000;
  if (unit === "h") return n * 60 * 60 * 1000;
  if (unit === "d") return n * 24 * 60 * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
}

const login = async (req, res) => {
  const { usuarioLogin, contraseña } = req.body;
  const resultado = await loginBD(usuarioLogin, contraseña);

  if (resultado.status !== 200) {
    return res.status(resultado.status).json({ msg: resultado.msg });
  }

  
  res.cookie(COOKIE_NAME, resultado.data.refreshToken, cookieOptions());

  return res.status(resultado.status).json({
    msg: resultado.msg,
    token: resultado.data.accessToken,
    data: { usuario: resultado.data.usuario },
  });
};

const refresh = async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  
  
  
  
  
  if (!token) {
    return res.status(401).json({ msg: "Usuario o contraseña incorrectos" });
  }

  const resultado = await refreshTokenBD(token);

  if (resultado.status !== 200) {
    return res.status(resultado.status).json({ msg: resultado.msg });
  }

  res.cookie(COOKIE_NAME, resultado.data.refreshToken, cookieOptions());

  return res.status(resultado.status).json({
    msg: resultado.msg,
    token: resultado.data.accessToken,
    data: { usuario: resultado.data.usuario },
  });
};

const logout = async (req, res) => {
  const resultado = await logoutBD();

  res.clearCookie(COOKIE_NAME, { path: "/api/auth/refresh" });

  return res.status(resultado.status).json({ msg: resultado.msg });
};

module.exports = { login, refresh, logout };
