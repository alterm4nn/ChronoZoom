var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormManageEditors = (function (_super) {
            __extends(FormManageEditors, _super);
            function FormManageEditors(container, formInfo) {
                _super.call(this, container, formInfo);

                CZ.Service.getMembers().done(function (data) {
                    if (data.length == 0) {
                        $('#tblDelEditors tbody').append('<tr><td colspan="2" class="cz-lightgray center">&mdash; None &mdash;</td></tr>');
                    } else {
                        data.forEach(function (member) {
                            $('#tblDelEditors tbody').append('<tr data-id="' + member.User.Id + '">' + '<td class="delete" title="Remove Editor"></td>' + '<td title="' + member.User.DisplayName + '">' + member.User.DisplayName + '</td>' + '</tr>');
                        });
                    }
                });

                $('#tblAddEditors input[type="search"]').off('input').on('input', function (event) {
                    var _this = this;
                    CZ.Service.findUsers($(this).val()).done(function (data) {
                        $(_this).closest('table').find('tbody').html('');
                        $(_this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                        data.forEach(function (user) {
                            $('#tblAddEditors tbody').append('<tr data-id="' + user.Id + '">' + '<td class="select" title="Select/Unselect This User"><input type="checkbox" /></td>' + '<td title="' + user.DisplayName + '">' + user.DisplayName + '</td>' + '</tr>');
                        });
                        if (data.length == 0) {
                            $(_this).closest('table').find('tfoot').hide();
                        } else {
                            $(_this).closest('table').find('tfoot').show();
                        }
                    });
                });

                $('.cz-form-save').off().click(function (event) {
                    var userIds = JSON.stringify($('#tblDelEditors tbody tr').attr('data-id'));

                    CZ.Service.putMembers(CZ.Service.superCollectionName, CZ.Service.collectionName, userIds).always(function () {
                        $('#auth-edit-collection-editors').hide();
                    });
                });
            }
            return FormManageEditors;
        })(UI.FormUpdateEntity);
        UI.FormManageEditors = FormManageEditors;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
