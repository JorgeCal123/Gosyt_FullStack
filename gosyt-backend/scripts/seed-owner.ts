import { sequelize } from '../src/config/database';
import { Empresa } from '../src/modules/empresas/empresa.model';
import { Usuario } from '../src/modules/usuarios/usuarios.model';
import { hashPassword } from '../src/core/utils/hash';

async function seedOwner() {
    await sequelize.authenticate();

    // Empresa interna que representa a GoSYT como plataforma.
    // owner_gosyt pertenece a esta empresa, no a una empresa cliente.
    const [empresaGosyt] = await Empresa.findOrCreate({
        where: { correo_contacto: 'contacto@gosyt.com' },
        defaults: {
            nombre: 'GoSYT',
            correo_contacto: 'contacto@gosyt.com',
            telefono: '3000000000',
            estado: 'Activa',
        },
    });

    const correo = 'owner@gosyt.com';
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
        console.log('El owner_gosyt ya existe.');
        process.exit(0);
    }

    const password_hash = await hashPassword('1234');

    await Usuario.create({
        nombre: 'Owner',
        apellido: 'GoSYT',
        cedula: '000000000',
        tipo_documento: 'CC',
        correo,
        telefono: '3000000000',
        password_hash,
        rol: 'owner_gosyt',
        estado_habilitacion: 'Activo',
        estado_credenciales: 'CONTRASEÑA_CREADA',
        empresa_id: empresaGosyt.id, // ← antes era null
    });

    console.log('Owner_gosyt creado con correo:', correo);
    console.log('   Empresa asociada (GoSYT):', empresaGosyt.id);
    process.exit(0);
}

seedOwner().catch((err) => {
    console.error('Error creando owner_gosyt:', err);
    process.exit(1);
});