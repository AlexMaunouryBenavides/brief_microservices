export interface OptionProps {
  id: string;
  carId: string;
  name: string;
  description?: string;
  additionalPrice: number;
}

export class Option {
  readonly id: string;
  readonly carId: string;
  readonly name: string;
  readonly description?: string;
  readonly additionalPrice: number;

  constructor(props: OptionProps) {
    this.id = props.id;
    this.carId = props.carId;
    this.name = props.name;
    this.description = props.description;
    this.additionalPrice = props.additionalPrice;
  }

  withUpdated(fields: {
    name?: string;
    description?: string;
    additionalPrice?: number;
  }): Option {
    return new Option({
      id: this.id,
      carId: this.carId,
      name: fields.name ?? this.name,
      description: fields.description ?? this.description,
      additionalPrice: fields.additionalPrice ?? this.additionalPrice,
    });
  }
}
