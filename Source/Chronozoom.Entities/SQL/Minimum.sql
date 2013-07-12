CREATE FUNCTION Minimum (@x decimal, @y decimal)
RETURNS decimal
AS
BEGIN
	 IF @x <= @y
        RETURN @x
    ELSE
        RETURN @y

	RETURN NULL --Never Hits
END