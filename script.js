// Función para alternar entre registro y login
document.getElementById('toggleButton').addEventListener('click', function() {
    const registroForm = document.getElementById('registroForm');
    const loginSection = document.getElementById('loginSection');
    if (loginSection.style.display === 'none') {
        loginSection.style.display = 'block';
        registroForm.style.display = 'none';
        this.textContent = 'Registrarse';
    } else {
        loginSection.style.display = 'none';
        registroForm.style.display = 'block';
        this.textContent = 'Ingresar';
    }
});

// Función para manejar el envío del formulario de registro
document.getElementById('registroForm')?.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío por defecto

    // Obtener los valores del formulario simplificado
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar que los campos no estén vacíos
    if (nombre && email && password) {
        try {
            // Enviar petición POST al backend para registrar usuario
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                alert(`¡Registro exitoso! ${data.message}. Ahora inicia sesión.`);
                // Mostrar sección de login y ocultar registro
                document.getElementById('loginSection').style.display = 'block';
                document.getElementById('registroForm').style.display = 'none';
                this.textContent = 'Registrarse'; // Resetear botón
            } else {
                // Error en el registro (ej: usuario ya existe)
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            // Error de conexión
            console.error('Error al registrar:', error);
            alert('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Función para manejar el envío del formulario de login
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío por defecto

    // Obtener los valores del formulario (ahora con email)
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validar que los campos no estén vacíos
    if (email && password) {
        try {
            // Enviar petición POST al backend para login
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                alert(`¡Bienvenido, ${data.user.nombre}! Redirigiendo a la app...`);
                // Redirigir a la URL de Render (o localhost si es desarrollo)
                window.location.href = 'https://app-clima-5-vfd1.onrender.com';
            } else {
                // Error en el login
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            // Error de conexión
            console.error('Error al iniciar sesión:', error);
            alert('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Función para manejar el envío del formulario PQRS
document.getElementById('pqrsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío por defecto

    // Obtener los valores del formulario PQRS
    const tipo = document.getElementById('pqrsTipo').value;
    const mensaje = document.getElementById('pqrsMensaje').value;

    // Validar que los campos no estén vacíos
    if (tipo && mensaje) {
        // Aquí puedes agregar lógica para enviar el PQRS, por ejemplo, a un servidor
        alert(`PQRS enviado: ${tipo} - ${mensaje}`);
        // Limpiar el formulario
        document.getElementById('pqrsForm').reset();
    } else {
        alert('Por favor, completa todos los campos del PQRS.');
    }
});
