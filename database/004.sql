CREATE TABLE public.user_auth (
	auth_token VARCHAR(64) NOT NULL PRIMARY KEY,
	owner VARCHAR(32) NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
	gen_time TIMESTAMPTZ NOT NULL DEFAULT now(),
	exp_time TIMESTAMPTZ NOT NULL,
	ip VARCHAR(48) NOT NULL,
	client_info JSON NOT NULL
);
