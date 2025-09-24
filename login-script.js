// Sistema de Login Escolar - JavaScript
// Funcionalidad completa con validación en tiempo real y integración con el sistema existente

class LoginSystem {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.loginButton = document.getElementById('loginButton');
        this.buttonLoader = document.getElementById('buttonLoader');
        this.statusMessage = document.getElementById('statusMessage');
        this.forgotPasswordLink = document.getElementById('forgotPassword');
        this.registerLink = document.getElementById('registerLink');
        
        // Datos de usuarios (simulando base de datos)
        this.users = [];
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.loadUsers();
        this.setupEventListeners();
        this.setupAnimations();
        
        // Verificar si hay contenido en los campos al cargar
        setTimeout(() => {
            this.validateForm();
        }, 100);
    }

    // Cargar usuarios desde el archivo CSV existente
    async loadUsers() {
        try {
            const response = await fetch('teachers.csv');
            if (response.ok) {
                const csvText = await response.text();
                const lines = csvText.split('\n').filter(line => line.trim());
                
                lines.forEach((line, index) => {
                    if (index === 0) return; // Saltar encabezado
                    const columns = line.split(',');
                    if (columns.length >= 4) {
                        this.users.push({
                            id: columns[0].trim(),
                            username: columns[1].trim(),
                            password: columns[2].trim(),
                            name: columns[3].trim(),
                            type: columns[1].trim() === 'admin' ? 'admin' : 'teacher'
                        });
                    }
                });
            }
        } catch (error) {
            console.log('No se pudo cargar el archivo CSV, usando usuarios por defecto');
            // Usuarios por defecto basados en el CSV real
            this.users = [
                { id: '1', username: 'profesor', password: '123456', name: 'Profesor Principal', type: 'teacher' },
                { id: '2', username: 'admin', password: 'admin123', name: 'Administrador', type: 'admin' }
            ];
        }
    }

    setupEventListeners() {
        // Evento del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real
        this.usernameInput.addEventListener('input', () => {
            this.validateUsername();
            this.validateForm();
        });
        this.usernameInput.addEventListener('blur', () => {
            this.validateUsername();
            this.validateForm();
        });
        
        this.passwordInput.addEventListener('input', () => {
            this.validatePassword();
            this.validateForm();
        });
        this.passwordInput.addEventListener('blur', () => {
            this.validatePassword();
            this.validateForm();
        });
        
        // Toggle de contraseña
        this.passwordToggle.addEventListener('click', () => this.togglePassword());
        
        // Enlaces adicionales
        this.forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        this.registerLink.addEventListener('click', (e) => this.handleRegister(e));
        
        // Efectos de focus
        this.usernameInput.addEventListener('focus', () => this.addFocusEffect(this.usernameInput));
        this.passwordInput.addEventListener('focus', () => this.addFocusEffect(this.passwordInput));
        
        this.usernameInput.addEventListener('blur', () => this.removeFocusEffect(this.usernameInput));
        this.passwordInput.addEventListener('blur', () => this.removeFocusEffect(this.passwordInput));
    }

    setupAnimations() {
        // Animación de entrada de la página
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = '1';
        }, 100);
        
        // Efecto parallax sutil en el fondo
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.background-pattern');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    validateUsername() {
        const username = this.usernameInput.value.trim();
        const errorElement = document.getElementById('usernameError');
        
        if (!username) {
            this.showFieldError(this.usernameInput, errorElement, 'El usuario es requerido');
            return false;
        }
        
        if (username.length < 3) {
            this.showFieldError(this.usernameInput, errorElement, 'El usuario debe tener al menos 3 caracteres');
            return false;
        }
        
        this.showFieldSuccess(this.usernameInput, errorElement);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const errorElement = document.getElementById('passwordError');
        
        if (!password) {
            this.showFieldError(this.passwordInput, errorElement, 'La contraseña es requerida');
            return false;
        }
        
        if (password.length < 6) {
            this.showFieldError(this.passwordInput, errorElement, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        
        this.showFieldSuccess(this.passwordInput, errorElement);
        return true;
    }

    validateForm() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        // Validación básica: solo verificar que hay contenido
        const hasUsername = username.length >= 3;
        const hasPassword = password.length >= 6;
        
        this.loginButton.disabled = !(hasUsername && hasPassword);
        
        // Debug para verificar el estado
        console.log('Username:', username, 'Password length:', password.length);
        console.log('Has username:', hasUsername, 'Has password:', hasPassword);
        console.log('Button disabled:', this.loginButton.disabled);
    }

    showFieldError(input, errorElement, message) {
        input.classList.remove('success');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    showFieldSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
    }

    togglePassword() {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        
        // Cambiar icono
        const icon = this.passwordToggle.querySelector('svg path');
        if (type === 'text') {
            icon.setAttribute('d', 'M10 3C5.5 3 1.73 6.11 1 10.5C1.73 14.89 5.5 18 10 18C14.5 18 18.27 14.89 19 10.5C18.27 6.11 14.5 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z');
        } else {
            icon.setAttribute('d', 'M10 3C5.5 3 1.73 6.11 1 10.5C1.73 14.89 5.5 18 10 18C14.5 18 18.27 14.89 19 10.5C18.27 6.11 14.5 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z');
        }
    }

    addFocusEffect(input) {
        input.parentElement.style.transform = 'scale(1.02)';
    }

    removeFocusEffect(input) {
        input.parentElement.style.transform = 'scale(1)';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateUsername() || !this.validatePassword()) {
            return;
        }
        
        this.setLoadingState(true);
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        // Simular delay de autenticación
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const user = this.authenticateUser(username, password);
        
        if (user) {
            this.showStatusMessage('success', `¡Bienvenido, ${user.name}!`);
            this.currentUser = user;
            
            // Guardar sesión si está marcado "Recordar"
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                localStorage.setItem('userSession', JSON.stringify(user));
            }
            
            // Redirigir al sistema principal después de un delay
            setTimeout(() => {
                this.redirectToMainSystem();
            }, 2000);
        } else {
            this.showStatusMessage('error', 'Usuario o contraseña incorrectos');
            this.setLoadingState(false);
        }
    }

    authenticateUser(username, password) {
        return this.users.find(user => 
            user.username === username && user.password === password
        );
    }

    setLoadingState(loading) {
        this.loginButton.disabled = loading;
        
        if (loading) {
            this.loginButton.classList.add('loading');
        } else {
            this.loginButton.classList.remove('loading');
        }
    }

    showStatusMessage(type, message) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type} show`;
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
            this.statusMessage.classList.remove('show');
        }, 5000);
    }

    redirectToMainSystem() {
        // Guardar información del usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Redirigir al sistema principal
        window.location.href = 'index.html';
    }

    handleForgotPassword(e) {
        e.preventDefault();
        this.showStatusMessage('warning', 'Función de recuperación de contraseña próximamente disponible');
    }

    handleRegister(e) {
        e.preventDefault();
        this.showStatusMessage('warning', 'Función de registro próximamente disponible');
    }
}

// Utilidades adicionales
class FormUtils {
    static addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    static addFloatingLabel(input) {
        const label = input.previousElementSibling;
        if (label && label.classList.contains('form-label')) {
            input.addEventListener('focus', () => {
                label.style.transform = 'translateY(-20px) scale(0.8)';
                label.style.color = '#3b82f6';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = '#6b7280';
                }
            });
        }
    }
}

// Efectos visuales adicionales
class VisualEffects {
    static initParticleEffect() {
        const container = document.querySelector('.background-container');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(particle);
        }
        
        // Agregar keyframes para la animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    static addGlowEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de login
    const loginSystem = new LoginSystem();
    
    // Añadir efectos visuales
    VisualEffects.initParticleEffect();
    
    // Añadir efectos a elementos específicos
    const loginCard = document.querySelector('.login-card');
    const loginButton = document.getElementById('loginButton');
    
    VisualEffects.addGlowEffect(loginCard);
    FormUtils.addRippleEffect(loginButton);
    
    // Verificar si hay una sesión guardada
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
        try {
            const user = JSON.parse(savedSession);
            loginSystem.showStatusMessage('success', `Sesión restaurada para ${user.name}`);
            setTimeout(() => {
                loginSystem.currentUser = user;
                loginSystem.redirectToMainSystem();
            }, 1500);
        } catch (error) {
            localStorage.removeItem('userSession');
        }
    }
    
    // Manejar errores globales
    window.addEventListener('error', (e) => {
        console.error('Error en el sistema de login:', e.error);
    });
    
    // Prevenir envío accidental del formulario
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
        }
    });
});

// Exportar para uso global si es necesario
window.LoginSystem = LoginSystem;
window.FormUtils = FormUtils;
window.VisualEffects = VisualEffects;
