import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: 'customer' })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
