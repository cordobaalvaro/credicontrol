const UsuarioModel = require("../models/usuario.model");
const ZonaModel = require("../models/zona.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const crearUsuarioBD = async (datos) => {
  try {
    
    if (datos.telefono) {
      
      datos.telefono = datos.telefono.replace(/\s|-|\(|\)/g, '');

      
      if (!/^[0-9]{10,15}$/.test(datos.telefono)) {
        return {
          status: 400,
          msg: "El teléfono debe contener solo números y tener entre 10 y 15 dígitos",
          data: null,
        };
      }
    }

    if (datos.contraseña) {
      datos.contraseña = await argon2.hash(datos.contraseña);
    }

    const nuevoUsuario = new UsuarioModel(datos);
    await nuevoUsuario.save();

    if (datos.rol === "cobrador" && datos.zonaACargo) {

      
      if (Array.isArray(datos.zonaACargo)) {
        for (const zonaId of datos.zonaACargo) {
          await ZonaModel.findByIdAndUpdate(zonaId, {
            $addToSet: { cobrador: nuevoUsuario._id }
          });
        }
      } else {
        
        await ZonaModel.findByIdAndUpdate(datos.zonaACargo, {
          $addToSet: { cobrador: nuevoUsuario._id }
        });
      }
    }

    return {
      status: 201,
      msg: "Usuario creado correctamente",
      data: nuevoUsuario,
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        status: 400,
        msg: "Ya existe un usuario con este nombre de usuario",
        data: null,
      };
    }
    return {
      status: 500,
      msg: "Error al crear usuario",
      data: error.message,
    };
  }
};

const obtenerUsuariosBD = async (filtros = {}) => {
  try {
    let query = {};

    
    if (filtros.rol) {
      query.rol = filtros.rol;
    }

    let usuarios = await UsuarioModel.find(query).populate("zonaACargo");

    
    if (filtros.zonaFiltro === "conZona") {
      usuarios = usuarios.filter(
        (u) =>
          u.zonaACargo &&
          (Array.isArray(u.zonaACargo) ? u.zonaACargo.length > 0 : true)
      );
    } else if (filtros.zonaFiltro === "sinZona") {
      usuarios = usuarios.filter(
        (u) =>
          !u.zonaACargo ||
          (Array.isArray(u.zonaACargo) ? u.zonaACargo.length === 0 : false)
      );
    }

    
    if (filtros.q && filtros.q.trim()) {
      const q = filtros.q.toString().toLowerCase();
      usuarios = usuarios.filter((u) => {
        const nombre = (u.nombre || "").toLowerCase();
        const apellido = (u.apellido || "").toLowerCase();

        let zonaMatch = false;
        if (u.zonaACargo && Array.isArray(u.zonaACargo)) {
          zonaMatch = u.zonaACargo.some((z) =>
            (z.nombre || "").toLowerCase().includes(q)
          );
        } else if (u.zonaACargo && u.zonaACargo.nombre) {
          zonaMatch = (u.zonaACargo.nombre || "").toLowerCase().includes(q);
        }

        const nombreMatch =
          nombre.includes(q) ||
          apellido.includes(q);

        return nombreMatch || zonaMatch;
      });
    }

    return {
      status: 200,
      msg: "Lista de usuarios obtenida correctamente",
      data: usuarios,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener usuarios",
      data: error.message,
    };
  }
};

const obtenerUsuarioPorIdBD = async (id) => {
  try {
    const usuario = await UsuarioModel.findById(id).populate("zonaACargo");

    if (!usuario) {
      return {
        status: 404,
        msg: "Usuario no encontrado",
        data: null,
      };
    }

    return {
      status: 200,
      msg: "Usuario encontrado",
      data: usuario,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener usuario",
      data: error.message,
    };
  }
};

const actualizarUsuarioBD = async (id, datos) => {
  try {
    const usuarioActual = await UsuarioModel.findById(id).populate(
      "zonaACargo"
    );
    if (!usuarioActual) {
      return {
        status: 404,
        msg: "Usuario no encontrado",
        data: null,
      };
    }

    
    if (datos.telefono) {
      
      datos.telefono = datos.telefono.replace(/\s|-|\(|\)/g, '');

      
      if (!/^[0-9]{10,15}$/.test(datos.telefono)) {
        return {
          status: 400,
          msg: "El teléfono debe contener solo números y tener entre 10 y 15 dígitos",
          data: null,
        };
      }
    }

    if (datos.contraseña) {
      datos.contraseña = await argon2.hash(datos.contraseña);
    }

    if (
      usuarioActual.rol === "cobrador" &&
      datos.zonaACargo
    ) {
      
      const zonasNuevas = (Array.isArray(datos.zonaACargo) ? datos.zonaACargo : [datos.zonaACargo])
        .map((z) => {
          if (z && typeof z === "object" && z._id) return z._id.toString();
          return typeof z === "string" ? z : String(z);
        })
        .filter((id) => /^[0-9a-fA-F]{24}$/.test(id));

      
      datos.zonaACargo = zonasNuevas;

      
      const zonasActuales = usuarioActual.zonaACargo
        ? usuarioActual.zonaACargo.map((z) => (z && z._id ? z._id.toString() : z.toString()))
        : [];

      
      const cambiosReales = JSON.stringify(zonasActuales.sort()) !== JSON.stringify(zonasNuevas.sort());

      if (cambiosReales) {
        
        const zonasARemover = zonasActuales.filter(zonaId => !zonasNuevas.includes(zonaId));
        for (const zonaId of zonasARemover) {
          
          if (typeof zonaId !== 'string' || !zonaId.match(/^[0-9a-fA-F]{24}$/)) {
            return {
              status: 400,
              msg: `ID de zona inválido: ${zonaId}`,
              data: null,
            };
          }

          await ZonaModel.findByIdAndUpdate(zonaId, {
            $pull: { cobrador: id }
          });
        }

        
        const zonasAAgregar = zonasNuevas.filter(zonaId => !zonasActuales.includes(zonaId));
        for (const zonaId of zonasAAgregar) {
          
          if (typeof zonaId !== 'string' || !zonaId.match(/^[0-9a-fA-F]{24}$/)) {
            return {
              status: 400,
              msg: `ID de zona inválido: ${zonaId}`,
              data: null,
            };
          }

          const zona = await ZonaModel.findById(zonaId);
          if (!zona) {
            return {
              status: 404,
              msg: `La zona especificada no existe: ${zonaId}`,
              data: null,
            };
          }
          await ZonaModel.findByIdAndUpdate(zonaId, {
            $addToSet: { cobrador: id }
          });
        }
      }
    }

    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(id, datos, {
      new: true,
    }).populate("zonaACargo");

    return {
      status: 200,
      msg:
        datos.zonaACargo &&
          datos.zonaACargo !== usuarioActual.zonaACargo?.toString()
          ? "Usuario actualizado correctamente y zona reasignada"
          : "Usuario actualizado correctamente",
      data: usuarioActualizado,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al actualizar usuario",
      data: error.message,
    };
  }
};

const eliminarUsuarioBD = async (id) => {
  try {
    const usuario = await UsuarioModel.findById(id);

    if (!usuario) {
      return {
        status: 404,
        msg: "Usuario no encontrado",
        data: null,
      };
    }

    if (usuario.zonaACargo && usuario.zonaACargo.length > 0) {
      await ZonaModel.updateMany(
        { _id: { $in: usuario.zonaACargo } },
        { $pull: { cobrador: id } }
      );
    }


    const usuarioEliminado = await UsuarioModel.findByIdAndDelete(id);

    return {
      status: 200,
      msg: "Usuario eliminado correctamente y referencias en zonas actualizadas",
      data: usuarioEliminado,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al eliminar usuario",
      data: error.message,
    };
  }
};
const loginUsuarioBD = async ({ usuarioLogin, contraseña }) => {
  try {
    const usuario = await UsuarioModel.findOne({ usuarioLogin: usuarioLogin });

    if (!usuario) {
      return {
        status: 404,
        msg: "Usuario no encontrado",
        data: null,
      };
    }

    const passwordValido = await argon2.verify(usuario.contraseña, contraseña);
    if (!passwordValido) {
      return {
        status: 401,
        msg: "Contraseña incorrecta",
        data: null,
      };
    }

    const token = jwt.sign(
      {
        idUsuario: usuario._id,
        rolUsuario: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      status: 200,
      msg: "Inicio de sesión exitoso",
      token,
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          rol: usuario.rol,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al iniciar sesión: " + error.message,
      data: null,
    };
  }
};



module.exports = {
  crearUsuarioBD,
  obtenerUsuariosBD,
  obtenerUsuarioPorIdBD,
  actualizarUsuarioBD,
  eliminarUsuarioBD,
  loginUsuarioBD,
};
