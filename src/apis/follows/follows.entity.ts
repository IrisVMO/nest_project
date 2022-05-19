import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'Follow' })
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { generated: 'uuid', array: true, default: '{}' })
  userIdFollower: string[];

  @Column('text', { generated: 'uuid', array: true, default: '{}' })
  userIdFollowing: string[];

  @ManyToOne(() => User, (user) => user.follows)
  user: User;
}
