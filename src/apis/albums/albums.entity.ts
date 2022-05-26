import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Photo } from '../photos/photos.entity';
import { User } from '../users/users.entity';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export enum StatusAlbumUser {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum Role {
  Owner = 'Owner',
  Contribute = 'Contribute',
}

@Entity({ name: 'Album' })
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Public,
  })
  status: Status;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[];

  @OneToMany(() => AlbumUser, (albumUser) => albumUser.album)
  albumUsers: AlbumUser[];
}

@Entity({ name: 'AlbumUser' })
export class AlbumUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'uuid' })
  userId: string;

  @Column({ generated: 'uuid' })
  albumId: string;

  @Column({ type: 'enum', enum: Role, default: 'Owner' })
  role: Role;

  @Column({ type: 'enum', enum: StatusAlbumUser, default: 'Active' })
  status: StatusAlbumUser;

  @ManyToOne(() => Album, (album) => album.albumUsers)
  album: Album;

  @ManyToOne(() => User, (user) => user.albumUsers)
  user: User;
}
