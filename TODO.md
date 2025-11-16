# TODO: Revisión completa del código y pruebas

## Agregar Comentarios
- [x] Agregar comentarios faltantes en backend/index.js
- [x] Agregar comentarios faltantes en backend/routes/UserRoutes.js
- [x] Agregar comentarios faltantes en backend/controllers/User.Controller.js
- [x] Agregar comentarios faltantes en backend/models/User.js
- [x] Agregar comentarios faltantes en backend/db.js
- [x] Agregar comentarios faltantes en index.html
- [x] Agregar comentarios faltantes en script.js
- [x] Agregar comentarios faltantes en login.html

## Modificar Frontend para Conectar con Backend
- [x] Modificar script.js: Cambiar registro para enviar POST a /api/users/register con nombre, email, password
- [x] Modificar script.js: Cambiar login para enviar POST a /api/users/login con email, password
- [x] Simplificar index.html: Formulario de registro solo con nombre (combinar nombres), email, password
- [x] Modificar login.html: Usar email en lugar de documento

## Probar Funcionalidad
- [x] Iniciar servidor backend con npm run dev
- [x] Probar registro: Enviar datos, verificar guardado en DB, prevenir duplicados
- [x] Probar login: Iniciar sesión con email y password
- [x] Verificar que no se pueda registrar de nuevo con mismo email
