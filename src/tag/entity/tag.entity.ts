import { BaseEntity } from 'src/core/BaseEntity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

type TagRelations = 'createdBy';

@Entity()
class Tag extends BaseEntity<Tag, TagRelations> {
  declare readonly __brand: symbol & { __brand: 'TagEntity' };

  @Column()
  description!: string;

  @Column()
  color!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  createdBy?: User;

  constructor(data?: { description: string; color: string; userId: number }) {
    super();

    if (data !== undefined) {
      this.description = data.description;
      this.color = data.color;
      this.userId = data.userId;
    }
  }
}

export { Tag };
