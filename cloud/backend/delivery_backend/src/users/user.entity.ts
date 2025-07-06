import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  // TODO: we shall store hash of the password with salt
  @Column()
  password: string;

  @Column()
  role: string;
}
