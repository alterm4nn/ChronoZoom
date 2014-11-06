using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Used to provide data for tiles on Home Page Overlay, and My Collections overlay, or elsewhere, in a common format.
    /// The link should be in a short a format as possible. e.g. If the default collection, do not include the collection path in the URL.
    /// </summary>
    public class Tile
    {
        [Required]  public string   CollectionName      { get; set; }   // the display name of the collection rather than the path
        [Required]  public string   CuratorName         { get; set; }   // the display name of the curator
        [Required]  public string   Link                { get; set; }   // URL starting from "/" (without protocol or domain)
                    public string   Type                { get; set; }   // optional if wishing to indicate type such as "exhibit"
                    public string   Title               { get; set; }   // optional display name of a timelink or exhibit
                    public decimal  Year                { get; set; }   // optional for formatting and display beneath title - NOTE: can be null
                    public string   CustomBackground    { get; set; }   // leave out to use standard tile background
        [Required]  public Boolean  IsCosmosCollection  { get; set; }   // If custom background missing then can potentially use this to choose a special Cosmos background
        [Required]  public Boolean  IsCurrentCollection { get; set; }   // UI sets this to true to indicate page load not required

        /// <summary>
        /// constructor - used to set defaults
        /// </summary>
        public Tile()
        {
            Type                = "";       // convenient to have empty strings so don't have to check for missing or nulls too
            Title               = "";       // "
            CustomBackground    = "";       // "
            IsCosmosCollection  = false;
            IsCurrentCollection = false;
        }
    }
}
