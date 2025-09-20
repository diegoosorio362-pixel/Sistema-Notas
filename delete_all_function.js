// Función para eliminar todos los estudiantes
async function handleDeleteAllStudents() {
    const confirmMessage = `⚠️ ADVERTENCIA ⚠️

¿Está seguro que desea eliminar TODOS los estudiantes?

Esta acción NO se puede deshacer.

Escriba "ELIMINAR" para confirmar:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput !== "ELIMINAR") {
        showAlert('Operación cancelada', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/students/delete-all', {
            method: 'DELETE'
        });
        
        if (response.ok) {
            students = [];
            displayStudentsList();
            updateDashboardStats();
            showAlert('✅ Todos los estudiantes han sido eliminados exitosamente', 'success');
        } else {
            const error = await response.json();
            showAlert(`Error al eliminar estudiantes: ${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar todos los estudiantes:', error);
        showAlert('Error de conexión al eliminar estudiantes', 'error');
    }
}
