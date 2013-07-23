namespace Application.Helper.Entities
{
    public class Bookmark : Chronozoom.Entities.Bookmark
    {
        public string Type { get; set; }
        public override string ToString()
        {
            return string.Format("[Bookmark: Name = {0}", Name);
        }
    }
}