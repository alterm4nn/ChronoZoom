using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Authoring.WebRole.Models;

namespace Authoring.WebRole.Controllers
{
    internal static class Authorization
    {
        private static ChronozoomEntities db = new ChronozoomEntities();

        private static string read = Permission.read.ToString();
        private static string write = Permission.write.ToString();
        private static string delete = Permission.delete.ToString();
        private static string admin = Permission.admin.ToString();

        internal static string GetAccess(string table, string username)
        {
            var perm = from Perm in db.AuthoringTableRolePermissions
                       join t in db.AuthoringTables on Perm.AuthoringTableID equals t.ID
                       join user in db.Users on Perm.RoleID equals user.RoleID
                       where t.AuthoringTable1 == table && user.UserName == username && (t.IsDeleted == null || t.IsDeleted == false) && (Perm.IsDeleted == null || Perm.IsDeleted == false) && (user.IsDeleted == null || user.IsDeleted == false)
                       select Perm;
            var rp = perm.FirstOrDefault<AuthoringTableRolePermission>();
            if (rp == null)
                return null;
            byte rolepermission = rp.Permission;

            if (Authorization.GetPermission(rolepermission, admin))
                return admin;
            else if (Authorization.GetPermission(rolepermission, delete))
                return delete;
            else if (Authorization.GetPermission(rolepermission, write))
                return write;
            else if (Authorization.GetPermission(rolepermission, read))
                return read;
            else 
                return null;
        }

        internal static bool GetAccess(string table, string username, string permission)
        {
            var perm = from Perm in db.AuthoringTableRolePermissions
                       join t in db.AuthoringTables on Perm.AuthoringTableID equals t.ID
                       join user in db.Users on Perm.RoleID equals user.RoleID
                       where t.AuthoringTable1 == table && user.UserName == username && (t.IsDeleted == null || t.IsDeleted == false) && (Perm.IsDeleted == null || Perm.IsDeleted == false) && (user.IsDeleted == null || user.IsDeleted == false)
                       select Perm;
            var rp = perm.FirstOrDefault<AuthoringTableRolePermission>();
            if (rp == null)
                return false;
            byte rolepermission = rp.Permission;
            if (Authorization.GetPermission(rolepermission, permission))
                return true;
            else
                return false;
        }
        private static bool GetPermission(byte rolepermission, string reqpermission)
        {
            //string user = HttpContext.User.Identity.Name;
             
            Authoring.WebRole.Models.Permission permission = db.Permissions.FirstOrDefault(p => p.Permission1 == reqpermission && (p.IsDeleted == null || p.IsDeleted == false));
            if (permission == null)
                return false;
            byte requestpermission = permission.IntRepresentation.HasValue == true ? permission.IntRepresentation.Value : (byte)0;
            
            int providedPermission = rolepermission & requestpermission;
            if (providedPermission < requestpermission)
                return false;
            else
                return true;
        }
    }
}