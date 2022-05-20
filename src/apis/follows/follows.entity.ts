import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'Follow' })
@Unique(['userIdFollowing'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'uuid' })
  userId: string;

  @Column('text', {
    array: true,
    default: [],
  })
  public userIdFollowing: string[];

  @OneToOne(() => User, (user) => user.follows)
  @JoinColumn()
  user: User;
}
