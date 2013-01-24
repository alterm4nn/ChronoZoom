using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Linq.Expressions;
using System.Globalization;

namespace Authoring.WebRole.Helpers
{
    public static class HtmlTextAreaExtensions
    {
        public static IHtmlString TextAreaFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, int rows, int cols, object htmlAttributes = null, string Value = null)
        {
            return TextAreaFor<TModel, TProperty>(htmlHelper, expression, rows, cols, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes), Value);
        }

        public static IHtmlString TextAreaFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, int rows, int cols, IDictionary<string, string> htmlAttributes = null, string Value = null)
        {
            var modelMetadata = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            var name = ExpressionHelper.GetExpressionText(expression);

            string fullName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);

            Dictionary<string, object> rowsAndColumns = new Dictionary<string, object>();
            if (rows > 0)
            {
                rowsAndColumns.Add("rows", rows.ToString(CultureInfo.InvariantCulture));
            }
            else
            {
                rowsAndColumns.Add("rows", "5");
            }
            if (cols > 0)
            {
                rowsAndColumns.Add("cols", cols.ToString(CultureInfo.InvariantCulture));
            }
            else
            {
                rowsAndColumns.Add("cols", "20");
            }
            TagBuilder tagBuilder = new TagBuilder("textarea");
            tagBuilder.GenerateId(fullName);
            tagBuilder.MergeAttributes(htmlAttributes, true);
            tagBuilder.MergeAttributes(rowsAndColumns, false);  // Only force explicit rows/cols 
            tagBuilder.MergeAttribute("name", fullName, true);

            // If there are any errors for a named field, we add the CSS attribute. 
            ModelState modelState;
            if (htmlHelper.ViewData.ModelState.TryGetValue(fullName, out modelState) && modelState.Errors.Count > 0)
            {
                tagBuilder.AddCssClass(HtmlHelper.ValidationInputCssClassName);
            }

            tagBuilder.MergeAttributes(htmlHelper.GetUnobtrusiveValidationAttributes(name));

            string value;
            if (Value != null)
            {
                value = Value;
            }
            else if (modelState != null && modelState.Value != null)
            {
                value = modelState.Value.AttemptedValue;
            }
            else if (modelMetadata.Model != null)
            {
                value = modelMetadata.Model.ToString();
            }
            else
            {
                value = String.Empty;
            }

            // The first newline is always trimmed when a TextArea is rendered, so we add an extra one 
            // in case the value being rendered is something like "\r\nHello". 
            tagBuilder.SetInnerText(Environment.NewLine + value);

            return new HtmlString(tagBuilder.ToString(TagRenderMode.Normal));
        }
    } 

}