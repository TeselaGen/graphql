CREATE OR REPLACE FUNCTION log_user()
  RETURNS TRIGGER AS
$BODY$
BEGIN

 INSERT INTO "AccessLogs" (message)
 SELECT current_setting('tg.lims_user', true);
 
 RETURN NEW;
END;
$BODY$


LANGUAGE plpgsql VOLATILE
COST 100;


DROP TRIGGER IF EXISTS log_user_insert_trigger ON "Users";
DROP TRIGGER IF EXISTS log_user_update_trigger ON "Users";

CREATE TRIGGER log_user_insert_trigger
  BEFORE INSERT
  ON "Users"
  FOR EACH ROW
  EXECUTE PROCEDURE log_user();


CREATE TRIGGER log_user_update_trigger
  BEFORE UPDATE
  ON "Users"
  FOR EACH ROW
  EXECUTE PROCEDURE log_user();



