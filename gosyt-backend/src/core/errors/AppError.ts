export class AppError extends Error {

    // --- atributo para almacenar el código de estado HTTP ---
    public statusCode: number;

    // --- constructor para crear un error personalizado ---
    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}