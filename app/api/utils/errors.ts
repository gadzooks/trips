// app/api/utils/errors.ts

export class TripError extends Error {
    constructor(
      message: string,
      public statusCode: number = 500,
      public code: string = 'INTERNAL_SERVER_ERROR'
    ) {
      super(message)
      this.name = 'TripError'
    }
  }
  
  export class AccessDeniedError extends TripError {
    constructor(message: string = 'Access denied') {
      super(message, 403, 'ACCESS_DENIED')
      this.name = 'AccessDeniedError'
    }
  }
  
  export class ValidationError extends TripError {
    constructor(message: string) {
      super(message, 400, 'VALIDATION_ERROR')
      this.name = 'ValidationError'
    }
  }
  
  export class NotFoundError extends TripError {
    constructor(message: string = 'Resource not found') {
      super(message, 404, 'NOT_FOUND')
      this.name = 'NotFoundError'
    }
  }