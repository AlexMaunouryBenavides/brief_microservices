export class CarNotFoundError extends Error {
  constructor(id: string) {
    super(`Car not found: ${id}`);
    this.name = 'CarNotFoundError';
  }
}

export class OptionNotFoundError extends Error {
  constructor(id: string) {
    super(`Option not found: ${id}`);
    this.name = 'OptionNotFoundError';
  }
}

export class OptionNotBelongToCarError extends Error {
  constructor(optionId: string, carId: string) {
    super(`Option ${optionId} does not belong to car ${carId}`);
    this.name = 'OptionNotBelongToCarError';
  }
}
