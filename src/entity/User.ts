import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'Partner' | 'Customer' | 'Admin' | 'Affiliate';

  @Column()
  role: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  verified: number;

  @Column()
  facebook_id: string;

  @Column()
  hash: string;

  @Column()
  hash_expired: number;

  @Column()
  password: string;

  @Column()
  password_reset: string;

  @Column()
  email_ref: string;

  @Column()
  email_ref_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;
}
