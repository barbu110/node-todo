CREATE TABLE IF NOT EXISTS "user_properties" (
    user_id VARCHAR(32) NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    prop_key VARCHAR(128) NOT NULL,
    prop_val BYTEA DEFAULT NULL,
    PRIMARY KEY (user_id, prop_key)
);
