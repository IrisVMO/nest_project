import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'Follow' })
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ generated: 'uuid' })
  userIdFollowTo: string;

  @Column({ generated: 'uuid' })
  userIdFollowFrom: string;

  @ManyToOne(() => User, (user) => user.follows)
  user: User;
}
