const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const UsuarioModel = require("../models/usuario.model");

const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_TTL || "10m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_TTL || "7d";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";

function signAccessToken(user) {
  return jwt.sign(
    { idUsuario: user._id.toString(), rolUsuario: user.rol },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      idUsuario: user._id.toString(),
      tokenVersion: user.tokenVersion || 0,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}


const loginBD = async (usuarioLogin, contraseña) => {
  try {
    if (!usuarioLogin || !contraseña) {
      return {
        status: 400,
        msg: "Usuario y contraseña son requeridos",
        data: null,
      };
    }

    const user = await UsuarioModel.findOne({ usuarioLogin });
    if (!user) {
      return {
        status: 404,
        msg: "Usuario o contraseña incorrectos",
        data: null,
      };
    }

    const ok = await argon2.verify(user.contraseña, contraseña);
    if (!ok) {
      return {
        status: 401,
        msg: "Usuario o contraseña incorrectos",
        data: null,
      };
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {
      status: 200,
      msg: "Inicio de sesión exitoso",
      data: {
        accessToken,
        refreshToken,
        usuario: {
          id: user._id,
          nombre: user.nombre,
          rol: user.rol,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al iniciar sesión",
      data: null,
    };
  }
};


const refreshTokenBD = async (oldToken) => {
  try {
    if (!oldToken) {
      return {
        status: 401,
        msg: "Token de refresco no proporcionado",
        data: null,
      };
    }

    const payload = jwt.verify(oldToken, REFRESH_SECRET);
    const user = await UsuarioModel.findById(payload.idUsuario);

    if (!user) {
      return {
        status: 401,
        msg: "Usuario no encontrado o token inválido",
        data: null,
      };
    }

    if ((user.tokenVersion || 0) !== payload.tokenVersion) {
      return {
        status: 401,
        msg: "Token inválido o revocado",
        data: null,
      };
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {
      status: 200,
      msg: "Token renovado exitosamente",
      data: {
        accessToken,
        refreshToken,
        usuario: {
          id: user._id,
          nombre: user.nombre,
          rol: user.rol,
        },
      },
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        status: 401,
        msg: "Token expirado",
        data: null,
      };
    }
    return {
      status: 401,
      msg: "Token inválido",
      data: null,
    };
  }
};


const logoutBD = async () => {
  try {
    return {
      status: 200,
      msg: "Sesión cerrada exitosamente",
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al cerrar sesión",
      data: null,
    };
  }
};

module.exports = {
  loginBD,
  refreshTokenBD,
  logoutBD,
};
