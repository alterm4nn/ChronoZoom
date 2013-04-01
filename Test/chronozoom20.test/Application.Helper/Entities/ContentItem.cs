namespace Application.Helper.Entities
{
    public class ContentItem
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Uri { get; set; }
        public string MediaType { get; set; }

        public override string ToString()
        {
            return string.Format("[ContentItem: Title = {0}, Description = {1}, Uri = {2}, MediaType = {3}]", Title, Description, Uri, MediaType);
        }
    }
}