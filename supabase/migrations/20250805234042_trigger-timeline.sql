CREATE OR REPLACE FUNCTION touch_job_position()  
RETURNS trigger  
LANGUAGE plpgsql AS
$$
BEGIN
  UPDATE public.job_position
     SET updated_at = now()
   WHERE id = COALESCE(NEW.position_id, OLD.position_id);
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_timeline_touch_job_position
  AFTER INSERT OR UPDATE OR DELETE
  ON public.timeline_item
  FOR EACH ROW
  EXECUTE FUNCTION touch_job_position();
