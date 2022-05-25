import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'Follow' })
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

  @Column('text', {
    array: true,
    default: [],
  })
  public userIdFollower: string[];

  @OneToOne(() => User, (user) => user.follow)
  @JoinColumn()
  user: User;
}
