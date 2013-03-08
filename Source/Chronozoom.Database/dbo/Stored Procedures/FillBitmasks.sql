CREATE PROCEDURE [dbo].[FillBitmasks]
AS
BEGIN
	DECLARE @r int 
	DECLARE @v int 
	SET @r = 0;
	SET @v = 1;
	WHILE (@r < 31)
	BEGIN 
		INSERT INTO Bitmasks VALUES (-@v * 2, @v);
		SET @v = @v * 2;
		SET @r = @r + 1;
	END
END
