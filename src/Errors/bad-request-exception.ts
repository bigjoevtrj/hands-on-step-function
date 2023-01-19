export class BadRequestException extends Error {
  constructor(Errors: any) {
    super();
    this.name = 'BadRequestException';
    this.message = JSON.stringify(Errors);
  }
}