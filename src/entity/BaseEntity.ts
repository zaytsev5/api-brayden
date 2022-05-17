import { BeforeUpdate, BeforeInsert } from 'typeorm';

export class BaseEntity {
  created: Date;
  modified: Date;

  @BeforeUpdate()
  updateUpdatedAt() {
    this.modified = new Date();
  }

  @BeforeInsert()
  updateCreatedAt() {
    this.created = new Date();
  }
}
