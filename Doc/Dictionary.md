# ChronoZoom Dictionary #

----------

## Entities ##

### Content Item ###

A pointer to a piece of content in ChronoZoom. The Content Item entity consists of a Url, Title, Caption, and Attribution. It is contained by an Exhibit, and is only viewable as part of an Exhibit.

### Exhibit ###

Contains a set of Content Items, and is contained by Timeline or a Collection. The Exhibit entity consists of a Title, Date, and Tags. It is externally searchable & linkable.

### Timeline ###

A visual representation of a time period that contains a set of Exhibits, child Timelines, and Time Series Data, and is contained by a Timeline or a Collection. The Timeline entity has a Title, Date Range, and Tags. It is externally searchable & linkable.

### Tour ###

A narrated tour with an audio track and media events that perform navigations to Timelines or Exhibits. The Tour entity has a Title and Tags.  It is contained by a Collection.  It is externally searchable & linkable.

### Collection ###

A set of Timelines, Exhibits, and Tours.  The Collection entity has a Title and Tags. It is externally searchable & linkable.

### SuperCollection ###

A set of Collections owned by a person. It is externally searchable & linkable.

### Tag ###

A grouping for related content. Content can be made visible/invisible by selecting one or more Tags for display.

----------

## Collections ##

### The Commons ###

A Collection containing the world of community shared content which is World:Write.

### Default Collection ###

A SuperCollection stored in ChronoZoom.Org which is the default content for new users.  When a user logs into the site, a copy of the Default collection becomes the starting point of their Personal Collection.

### Personal Collection ###

A SuperCollection stored in ChronoZoom.Org which is Owner:Write and World:Read.

### Private Collection ###

A SuperCollection stored in a personally owned and managed file.  Could be stored on SkyDrive or a simple website.

----------

## View Port ##

The current view of the timeline at a specific Date and Zoom Level.