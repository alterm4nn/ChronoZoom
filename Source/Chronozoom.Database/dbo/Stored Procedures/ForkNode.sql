CREATE PROCEDURE [dbo].[FillBitmasks]
@start_time int, @end_time int, @node int OUTPUT
AS
BEGIN
	SET @node = ((@start_time - 1) ^ @end_time) * 2;
	SET @node = @node | (@node * 2);
	SET @node = @node | (@node * 4);
	SET @node = @node | (@node * 16);
	SET @node = @node | (@node * 256);
	SET @node = @node | (@node * 65536);
	SET @node = @end_time & ~@node;
END
