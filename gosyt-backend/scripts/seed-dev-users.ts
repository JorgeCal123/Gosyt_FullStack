import { sequelize } from '../src/config/database';
import { Empresa } from '../src/modules/empresas/empresa.model';
import { Usuario } from '../src/modules/usuarios/usuarios.model';
import { hashPassword } from '../src/core/utils/hash';

async function seedDevUsers() {
    await sequelize.authenticate();

    const [empresa] = await Empresa.findOrCreate({
        where: { correo_contacto: 'contacto@empresademo.com' },
        defaults: {
            nombre: 'Empresa Demo',
            correo_contacto: 'contacto@empresademo.com',
            telefono: '3000000001',
            estado: 'Activa',
        },
    });

    const password_hash = await hashPassword('user1234');

    const usuarios = [
        { nombre: 'Admin', apellido: 'Empresa', rol: 'admin_empresa', correo: 'adminempresa@gmail.com', cedula: '111111111' },
        { nombre: 'Coordi', apellido: 'Nador', rol: 'coordinador', correo: 'coordinador@gmail.com', cedula: '111111112' },
        { nombre: 'Tecni', apellido: 'Co', rol: 'tecnico', correo: 'tecnico@gmail.com', cedula: '111111113' },
    ];

    for (const u of usuarios) {
        await Usuario.findOrCreate({
            where: { correo: u.correo },
            defaults: {
                ...u,
                tipo_documento: 'CC',
                telefono: '3000000002',
                password_hash,
                estado_habilitacion: 'Activo',
                estado_credenciales: 'CONTRASEÑA_CREADA',
                empresa_id: empresa.id,
            },
        });
    }

    console.log('Usuarios de prueba creados (password para todos: user1234)');
    process.exit(0);
}

seedDevUsers().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});