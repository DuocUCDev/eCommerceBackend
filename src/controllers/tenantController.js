const Tenant = require('../models/Tenant');
const User = require('../models/User');

/**
 * Crear nuevo tenant
 * POST /api/tenants
 */
const createTenant = async (req, res, next) => {
  try {
    const { name, slug, adminName, adminEmail, adminPassword } = req.body;

    // Validar campos requeridos
    if (!name || !slug) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: name, slug',
        statusCode: 400
      });
    }

    // Verificar que el slug no exista
    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      return res.status(409).json({
        message: 'El slug ya está en uso',
        statusCode: 409
      });
    }

    // Crear tenant
    const tenant = await Tenant.create({
      name,
      slug,
      isActive: true
    });

    // Opcionalmente crear admin inicial si se proporcionan credenciales
    let admin = null;
    if (adminName && adminEmail && adminPassword) {
      admin = await User.create({
        tenantId: tenant._id,
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Se hashea automáticamente
        role: 'admin',
        isActive: true
      });
    }

    const response = {
      message: 'Tenant creado exitosamente',
      statusCode: 201,
      data: {
        tenant: {
          id: tenant._id,
          name: tenant.name,
          slug: tenant.slug,
          isActive: tenant.isActive,
          createdAt: tenant.createdAt
        }
      }
    };

    // Agregar admin si fue creado
    if (admin) {
      response.data.admin = {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      };
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTenant
};
