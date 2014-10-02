/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/settings.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
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

                // populate list of existing editors
                CZ.Service.getMembers().done(function (data) {
                    if (data.length == 0) {
                        $('#tblDelEditors tbody').html('<tr class="none"><td colspan="2" class="cz-lightgray center">&mdash; None &mdash;</td></tr>');
                    } else {
                        $('#tblDelEditors tbody').html('');
                        data.forEach(function (member) {
                            $('#tblDelEditors tbody').append('<tr data-id="' + member.Id + '">' + '<td class="delete" title="Remove Editor"></td>' + '<td title="' + member.DisplayName + '">' + member.DisplayName + '</td>' + '</tr>');
                        });
                    }
                });

                // populate search results every time find input is altered
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

                // send chosen list of user ids when save button is clicked
                $('#auth-edit-collection-editors .cz-form-save').off().click(function (event) {
                    var userIds = new Array();

                    $('#tblDelEditors tbody tr:not(.none)').each(function (index) {
                        userIds.push($(this).attr('data-id'));
                    });

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
