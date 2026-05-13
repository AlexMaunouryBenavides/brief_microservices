import { Option } from './Option';

export interface CarProps {
  id: string;
  brand: string;
  model: string;
  year: number;
  rangeKm: number;
  powerKw: number;
  basePrice: number;
  imageUrl?: string;
  description?: string;
  options: Option[];
}

export class Car {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly year: number;
  readonly rangeKm: number;
  readonly powerKw: number;
  readonly basePrice: number;
  readonly imageUrl?: string;
  readonly description?: string;
  readonly options: Option[];

  constructor(props: CarProps) {
    this.id = props.id;
    this.brand = props.brand;
    this.model = props.model;
    this.year = props.year;
    this.rangeKm = props.rangeKm;
    this.powerKw = props.powerKw;
    this.basePrice = props.basePrice;
    this.imageUrl = props.imageUrl;
    this.description = props.description;
    this.options = props.options;
  }

  withUpdated(fields: Partial<Omit<CarProps, 'id' | 'options'>>): Car {
    return new Car({
      id: this.id,
      brand: fields.brand ?? this.brand,
      model: fields.model ?? this.model,
      year: fields.year ?? this.year,
      rangeKm: fields.rangeKm ?? this.rangeKm,
      powerKw: fields.powerKw ?? this.powerKw,
      basePrice: fields.basePrice ?? this.basePrice,
      imageUrl: fields.imageUrl ?? this.imageUrl,
      description: fields.description ?? this.description,
      options: this.options,
    });
  }

  withOptions(options: Option[]): Car {
    return new Car({ ...this, options });
  }
}
