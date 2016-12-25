CREATE TABLE post (
	token VARCHAR(16) NOT NULL PRIMARY KEY,
	owner VARCHAR(32) NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
	update_time TIMESTAMP NOT NULL DEFAULT now(),
	featured_picture VARCHAR(32) DEFAULT NULL REFERENCES media(id) ON DELETE CASCADE,
	headline VARCHAR(64),
	content TEXT,
	is_draft BOOLEAN DEFAULT TRUE
);

CREATE FUNCTION not_null_post_data()
	RETURNS trigger AS $not_null_post_content$
	BEGIN
		IF NEW.headline IS NULL AND NEW.is_draft = FALSE THEN
			RAISE EXCEPTION 'Only drafts can have null headline';
		END IF;
		IF NEW.content IS NULL AND NEW.is_draft = FALSE THEN
			RAISE EXCEPTION 'Only drafts can have null content';
		END IF;

		RETURN NEW;
	END;

$not_null_post_content$ LANGUAGE plpgsql;

CREATE TRIGGER tgr_block_null_post_data BEFORE INSERT OR UPDATE ON post FOR EACH ROW EXECUTE PROCEDURE not_null_post_data();
