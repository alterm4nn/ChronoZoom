using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;

namespace ThumbGen
{
    /// <summary>
    /// Interaction logic for InfodotGrid.xaml
    /// </summary>
    public partial class ContentItemControl : UserControl
    {
        public ContentItemControl()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Data of the Content Item which should be shown by this control
        /// </summary>
        internal ContentItem Data
        {
            set
            {
                title.Content = value.Title;
                description.Text = value.Caption;
                image.Source = value.thumbnail;
            }
        }
    }
}
