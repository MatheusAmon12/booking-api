-- Cria a tabela Users se ela não existir
CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
);

--Cria a tabela bookings se ela não existir

CREATE TABLE IF NOT EXISTS bookings(
    id TEXT PRIMARY KEY,
    room_id TEXT,
    guest_name TEXT,
    check_in_date DATE,
    check_out_date DATE,
    user_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);