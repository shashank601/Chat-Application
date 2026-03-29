export const up = (pgm) => {
  pgm.sql(`
    -- Users
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      pwd VARCHAR(255) NOT NULL CHECK (LENGTH(pwd) >= 8),
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Enums
    CREATE TYPE room_type AS ENUM ('direct', 'group');
    CREATE TYPE user_role AS ENUM ('admin', 'member');

    -- Rooms (without last_msg_ref first)
    CREATE TABLE IF NOT EXISTS rooms (
      room_id SERIAL PRIMARY KEY,
      type room_type DEFAULT 'direct',
      room_name VARCHAR(100)
    );

    -- Messages
    CREATE TABLE IF NOT EXISTS messages (
      msg_id SERIAL PRIMARY KEY,
      room_id INT REFERENCES rooms(room_id) ON DELETE CASCADE,
      sender_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
      content TEXT NOT NULL
    );

    -- Members
    CREATE TABLE IF NOT EXISTS members (
      room_id INT REFERENCES rooms(room_id) ON DELETE CASCADE,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      role user_role DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (room_id, user_id)
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS members;
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS rooms;
    DROP TYPE IF EXISTS room_type;
    DROP TYPE IF EXISTS user_role;
    DROP TABLE IF EXISTS users;
  `);
};